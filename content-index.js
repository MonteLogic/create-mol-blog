#!/usr/bin/env node

const { program } = require('commander');
const prompts = require('prompts');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function init() {
  let projectPath = '';

  program
    .name('create-mol-content')
    .description('CLI to scaffold a new MoL blog content repository')
    .argument('[project-directory]', 'Directory to create the content repository in')
    .action((dir) => {
      if (dir) {
        projectPath = dir;
      }
    });

  program.parse(process.argv);

  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your content repository named?',
      initial: 'my-mol-content',
      validate: (name) => {
        const validationMatch = name.match(/^[a-zA-Z0-9\-]+$/);
        if (validationMatch) return true;
        return 'Project name may only include letters, numbers, and dashes.';
      },
    });

    if (typeof res.path === 'string') {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log(chalk.red('Please specify the project directory:'));
    console.log(`  ${chalk.cyan('npx create-mol-content')} ${chalk.green('<project-directory>')}`);
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  if (fs.existsSync(resolvedProjectPath) && fs.readdirSync(resolvedProjectPath).length > 0) {
    console.log(chalk.red(`The directory ${chalk.green(projectPath)} is not empty.`));
    console.log(chalk.red('Please choose an empty directory or a new project name.'));
    process.exit(1);
  }

  console.log(`\nCreating a new MoL content repository in ${chalk.green(resolvedProjectPath)}.\n`);

  fs.ensureDirSync(resolvedProjectPath);

  const templateContentPath = path.join(__dirname, 'templates', 'mol-blog-template-content');

  if (!fs.existsSync(templateContentPath)) {
    console.log(chalk.red('Error: Template not found. This CLI package might be corrupted.'));
    process.exit(1);
  }

  console.log(`Copying files for content repository...`);
  fs.copySync(templateContentPath, resolvedProjectPath);

  // Rename variables in package.json
  const contentPackageJsonPath = path.join(resolvedProjectPath, 'package.json');
  if (fs.existsSync(contentPackageJsonPath)) {
    const pkg = fs.readJsonSync(contentPackageJsonPath);
    pkg.name = `${projectName}`;
    fs.writeJsonSync(contentPackageJsonPath, pkg, { spaces: 2 });
  }

  // Run pnpm install
  console.log(`\nInstalling dependencies in ${chalk.cyan(resolvedProjectPath)}...\n`);
  try {
    execSync('pnpm install', { stdio: 'inherit', cwd: resolvedProjectPath });
  } catch (err) {
    console.log(chalk.red('Failed to install dependencies. You can try running `pnpm install` manually.'));
  }

  console.log(`\n${chalk.green('Success!')} Created ${chalk.cyan(projectName)} at ${chalk.cyan(resolvedProjectPath)}`);
  console.log('\nInside that directory, you can run several commands:\n');
  console.log(`  ${chalk.cyan('pnpm run pipeline')}`);
  console.log('    Runs the content pipeline.\n');
  
  console.log('We suggest that you begin by typing:\n');
  console.log(`  ${chalk.cyan('cd')} ${projectPath}`);
  console.log('\nHappy content creation!');
}

init().catch((e) => {
  console.error(e);
});

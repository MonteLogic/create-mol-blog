// scripts/generate.ts
// Use CommonJS require for the utility file and built-in modules
const { generateMarkdownPaths } = require('../utils/paths/markdownPaths');
const path = require('path');
const fs = require('fs');

// Get the project root using the global process.cwd()
const projectRoot = process.cwd();

// Look for content in multiple locations (in order of priority):
// 1. Symlink inside project (./content)
// 2. Sibling directory (../content)
// 3. Environment variable CONTENT_DIR
const possiblePaths = [
  process.env['CONTENT_DIR'],
  path.join(projectRoot, 'content', 'posts'),
  path.join(projectRoot, '..', 'content', 'posts'),
].filter(Boolean);

let markdownSourceDir: string | null = null;

for (const p of possiblePaths) {
  if (p && fs.existsSync(p)) {
    markdownSourceDir = p;
    break;
  }
}

if (!markdownSourceDir) {
  console.error('Could not find content/posts directory.');
  console.error('Searched locations:');
  possiblePaths.forEach((p) => console.error(`  - ${p}`));
  console.error('\nTo fix this, either:');
  console.error('  1. Run: pnpm run setup (creates symlink)');
  console.error(
    '  2. Set CONTENT_DIR environment variable to the posts directory',
  );
  console.error('  3. Ensure content is a sibling directory');
  process.exit(1);
}

const outputJsonFile = path.join(projectRoot, 'generated/markdown-paths.json');

// Use projectRoot as the base directory for paths in the output JSON
const baseDirectoryForPaths = projectRoot;

// Call the utility function
generateMarkdownPaths(markdownSourceDir, outputJsonFile, baseDirectoryForPaths);

// Add this empty export statement to satisfy --isolatedModules
export {};

const fs = require('fs-extra');
const path = require('path');

const resolvedProjectPath = path.resolve('my-test-blog3');
const projectName = 'my-test-blog3';
const contentProjectName = 'my-test-blog3-content';
const webPackageJsonPath = path.join(resolvedProjectPath, 'package.json');

console.log(webPackageJsonPath);

/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

import {isVersioned} from '../src/versioning';

function checkVersionConventions(dir: string): string[] {
  let faultyFiles: string[] = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      faultyFiles = faultyFiles.concat(checkVersionConventions(filePath));
    } else {
      if (isVersioned(filePath)) {
        const versionPattern = /^.*__v\d+\.x\.mdx$|^.*__v\d+\.\d+\.\d+\.mdx$/;
        const basename = path.basename(filePath);

        if (!versionPattern.test(basename)) {
          faultyFiles.push(filePath);
        }
      }
    }
  }

  return faultyFiles;
}

const rootDir = 'docs';
const faultyFiles = checkVersionConventions(rootDir);

if (faultyFiles.length > 0) {
  console.error(
    'Error: The following files do not follow the correct versioning convention:'
  );
  faultyFiles.forEach(file => console.error(`  ${file}`));
  console.error(
    'Versioned files should end with __v{MAJOR}.x.mdx or __v{MAJOR}.{MINOR}.{PATCH}.mdx'
  );
  process.exit(1);
} else {
  console.log('✅ All files follow the correct versioning convention.');
}

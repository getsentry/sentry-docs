/* eslint-disable no-console */
import {execFileSync} from 'child_process';
import fs from 'fs';
import path from 'path';

interface Redirect {
  destination: string;
  source: string;
}

interface RenamedFile {
  isDeveloperDocs: boolean;
  newPath: string;
  newUrl: string;
  oldPath: string;
  oldUrl: string;
}

interface MissingRedirect {
  isDeveloperDocs: boolean;
  newPath: string;
  newUrl: string;
  oldPath: string;
  oldUrl: string;
}

/**
 * Converts a file path to a URL slug
 * - Removes `docs/` or `develop-docs/` prefix
 * - Handles `index.mdx` files by converting to directory path
 * - Returns both with and without trailing slash variants
 */
function filePathToUrls(filePath: string): {isDeveloperDocs: boolean; urls: string[]} {
  const isDeveloperDocs = filePath.startsWith('develop-docs/');
  const prefix = isDeveloperDocs ? 'develop-docs/' : 'docs/';

  if (!filePath.startsWith(prefix)) {
    return {isDeveloperDocs: false, urls: []};
  }

  // Remove prefix and extension
  let slug = filePath.slice(prefix.length);
  if (slug.endsWith('.mdx') || slug.endsWith('.md')) {
    slug = slug.replace(/\.(mdx|md)$/, '');
  }

  // Handle index files
  if (slug.endsWith('/index')) {
    slug = slug.replace(/\/index$/, '');
    // Return both with and without trailing slash
    return {isDeveloperDocs, urls: [`/${slug}/`, `/${slug}`]};
  }

  // Return URL path
  return {isDeveloperDocs, urls: [`/${slug}`, `/${slug}/`]};
}

/**
 * Detects renamed/moved MDX files using git diff
 */
function detectRenamedFiles(): RenamedFile[] {
  try {
    // Get base branch (usually origin/master or the PR's base)
    const baseBranch = process.env.GITHUB_BASE_REF || 'master';
    const baseSha = process.env.GITHUB_BASE_SHA || `origin/${baseBranch}`;
    const headSha = process.env.GITHUB_SHA || 'HEAD';

    // Use git diff to find renames (similarity threshold of 50%)
    const diffOutput = execFileSync(
      'git',
      ['diff', '--find-renames=50%', '--name-status', `${baseSha}...${headSha}`],
      {encoding: 'utf8', stdio: 'pipe'}
    )
      .toString()
      .trim();

    const renamedFiles: RenamedFile[] = [];

    for (const line of diffOutput.split('\n')) {
      if (!line.trim()) continue;

      // Format: R<similarity>	old-path	new-path
      // or R	old-path	new-path
      const match = line.match(/^R(\d+)?\s+(.+?)\s+(.+)$/);
      if (!match) continue;

      const [, , oldPath, newPath] = match;

      // Only process MDX/MD files
      if (!oldPath.match(/\.(mdx|md)$/) || !newPath.match(/\.(mdx|md)$/)) {
        continue;
      }

      // Only process files in docs/ or develop-docs/
      if (!oldPath.startsWith('docs/') && !oldPath.startsWith('develop-docs/')) {
        continue;
      }
      if (!newPath.startsWith('docs/') && !newPath.startsWith('develop-docs/')) {
        continue;
      }

      const oldPathInfo = filePathToUrls(oldPath);
      const newPathInfo = filePathToUrls(newPath);

      // They should be in the same category (both docs or both develop-docs)
      if (oldPathInfo.isDeveloperDocs !== newPathInfo.isDeveloperDocs) {
        console.warn(
          `⚠️  Warning: File moved between docs/ and develop-docs/: ${oldPath} → ${newPath}`
        );
      }

      // Create entries for all URL variants
      for (const oldUrl of oldPathInfo.urls) {
        for (const newUrl of newPathInfo.urls) {
          renamedFiles.push({
            oldPath,
            newPath,
            oldUrl,
            newUrl,
            isDeveloperDocs: oldPathInfo.isDeveloperDocs,
          });
        }
      }
    }

    return renamedFiles;
  } catch (error) {
    console.error('Error detecting renamed files:', error);
    return [];
  }
}

/**
 * Parses redirects.js to extract redirect entries
 * This uses regex-based parsing since redirects.js is a JavaScript file
 */
function parseRedirectsJs(filePath: string): {
  developerDocsRedirects: Redirect[];
  userDocsRedirects: Redirect[];
} {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  redirects.js not found at ${filePath}`);
    return {developerDocsRedirects: [], userDocsRedirects: []};
  }

  const content = fs.readFileSync(filePath, 'utf8');

  const developerDocsRedirects: Redirect[] = [];
  const userDocsRedirects: Redirect[] = [];

  // Extract developerDocsRedirects array
  // Find the start of the array (look for the const declaration, not JSDoc comments)
  const devDocsMatch = content.match(/const developerDocsRedirects\s*=/);
  if (devDocsMatch && devDocsMatch.index !== undefined) {
    // Find the opening bracket after the assignment
    const arrayStart = content.indexOf('[', devDocsMatch.index);
    if (arrayStart !== -1) {
      // Find the matching closing bracket by counting braces
      let depth = 0;
      let inString = false;
      let stringChar = '';
      let i = arrayStart;

      while (i < content.length) {
        const char = content[i];
        const prevChar = i > 0 ? content[i - 1] : '';

        // Handle string literals
        if (!inString && (char === '"' || char === "'") && prevChar !== '\\') {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && prevChar !== '\\') {
          inString = false;
        }

        // Count brackets only when not in string
        if (!inString) {
          if (char === '[') depth++;
          if (char === ']') {
            depth--;
            if (depth === 0) {
              // Found the closing bracket
              const arrayContent = content.slice(arrayStart + 1, i);
              developerDocsRedirects.push(...extractRedirectsFromArray(arrayContent));
              break;
            }
          }
        }
        i++;
      }
    }
  }

  // Extract userDocsRedirects array
  const userDocsMatch = content.match(/const userDocsRedirects\s*=/);
  if (userDocsMatch && userDocsMatch.index !== undefined) {
    const arrayStart = content.indexOf('[', userDocsMatch.index);
    if (arrayStart !== -1) {
      let depth = 0;
      let inString = false;
      let stringChar = '';
      let i = arrayStart;

      while (i < content.length) {
        const char = content[i];
        const prevChar = i > 0 ? content[i - 1] : '';

        if (!inString && (char === '"' || char === "'") && prevChar !== '\\') {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && prevChar !== '\\') {
          inString = false;
        }

        if (!inString) {
          if (char === '[') depth++;
          if (char === ']') {
            depth--;
            if (depth === 0) {
              const arrayContent = content.slice(arrayStart + 1, i);
              userDocsRedirects.push(...extractRedirectsFromArray(arrayContent));
              break;
            }
          }
        }
        i++;
      }
    }
  }

  return {developerDocsRedirects, userDocsRedirects};
}

/**
 * Extracts redirect objects from JavaScript array string
 * Handles both single and double quotes, and whitespace variations
 */
function extractRedirectsFromArray(arrayContent: string): Redirect[] {
  const redirects: Redirect[] = [];

  // Match redirect objects with more flexible whitespace handling
  // Handles both ' and " quotes, and various whitespace patterns including multiline
  // The pattern needs to match objects that span multiple lines
  const redirectRegex =
    /\{[\s\S]*?source:\s*['"]([^'"]+)['"][\s\S]*?destination:\s*['"]([^'"]+)['"][\s\S]*?\}/g;

  let match: RegExpExecArray | null = redirectRegex.exec(arrayContent);
  while (match !== null) {
    const source = match[1];
    const destination = match[2];

    if (source && destination) {
      redirects.push({
        source,
        destination,
      });
    }

    match = redirectRegex.exec(arrayContent);
  }

  return redirects;
}

/**
 * Checks if a redirect matches the expected old → new URL pattern
 * Handles path parameters like :path*, :platform, etc.
 */
function redirectMatches(redirect: Redirect, oldUrl: string, newUrl: string): boolean {
  // Simple exact match first
  if (redirect.source === oldUrl && redirect.destination === newUrl) {
    return true;
  }

  // Handle path parameters - convert patterns to regex
  const sourcePattern = redirect.source
    .replace(/:\w+\*/g, '.*')
    .replace(/:\w+/g, '[^/]+');
  const sourceRegex = new RegExp(`^${sourcePattern}$`);

  // Check if oldUrl matches the source pattern
  if (sourceRegex.test(oldUrl)) {
    // For destinations with path parameters, check if newUrl matches
    const destPattern = redirect.destination
      .replace(/:\w+\*/g, '.*')
      .replace(/:\w+/g, '[^/]+');
    const destRegex = new RegExp(`^${destPattern}$`);

    // If destination has no params, exact match
    if (!redirect.destination.includes(':')) {
      return redirect.destination === newUrl;
    }

    // If destination has params, check if pattern matches
    return destRegex.test(newUrl);
  }

  return false;
}

/**
 * Main validation function
 */
function validateRedirects(): MissingRedirect[] {
  const renamedFiles = detectRenamedFiles();

  if (renamedFiles.length === 0) {
    console.log('✅ No MDX file renames detected.');
    return [];
  }

  console.log(`📝 Found ${renamedFiles.length} renamed file(s) to check:`);
  renamedFiles.forEach(r => {
    console.log(`   ${r.oldPath} → ${r.newPath}`);
  });

  // Check if redirects.js was modified in this PR
  const baseBranch = process.env.GITHUB_BASE_REF || 'master';
  const baseSha = process.env.GITHUB_BASE_SHA || `origin/${baseBranch}`;
  const headSha = process.env.GITHUB_SHA || 'HEAD';

  // Determine which version of redirects.js to check
  // If redirects.js was modified in the PR, we should validate against the PR version
  // Otherwise, validate against the base branch version
  let redirectsFilePath = 'redirects.js';

  try {
    // Check if redirects.js was modified in this PR
    const modifiedFiles = execFileSync(
      'git',
      ['diff', '--name-only', `${baseSha}...${headSha}`],
      {
        encoding: 'utf8',
        stdio: 'pipe',
      }
    )
      .toString()
      .trim();

    const redirectsModified = modifiedFiles.includes('redirects.js');

    if (redirectsModified) {
      console.log('📝 redirects.js was modified in this PR, using PR version');
      redirectsFilePath = 'redirects.js';
    } else {
      // Try to get base version for comparison
      try {
        const baseRedirects = execFileSync('git', ['show', `${baseSha}:redirects.js`], {
          encoding: 'utf8',
          stdio: 'pipe',
        });
        // Write to temp file for parsing
        const tmpFile = path.join(process.cwd(), 'redirects-base.js');
        fs.writeFileSync(tmpFile, baseRedirects);
        redirectsFilePath = tmpFile;
        console.log('📝 redirects.js was not modified, using base branch version');
      } catch (err) {
        // If we can't get base version, use current file
        console.log(
          '⚠️  Could not get base version of redirects.js, using current version'
        );
        redirectsFilePath = 'redirects.js';
      }
    }
  } catch (err) {
    // If we can't determine, use current file
    console.log('⚠️  Could not determine redirects.js status, using current version');
    redirectsFilePath = 'redirects.js';
  }

  const {developerDocsRedirects, userDocsRedirects} = parseRedirectsJs(redirectsFilePath);

  // Clean up temp file after use
  try {
    const tmpFile = path.join(process.cwd(), 'redirects-base.js');
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  } catch {
    // Ignore cleanup errors
  }

  console.log(
    `📋 Found ${developerDocsRedirects.length} developer docs redirects and ${userDocsRedirects.length} user docs redirects`
  );

  const missingRedirects: MissingRedirect[] = [];

  for (const renamedFile of renamedFiles) {
    const redirectsToCheck = renamedFile.isDeveloperDocs
      ? developerDocsRedirects
      : userDocsRedirects;

    // Check if any redirect matches
    const hasRedirect = redirectsToCheck.some(redirect =>
      redirectMatches(redirect, renamedFile.oldUrl, renamedFile.newUrl)
    );

    if (!hasRedirect) {
      // Check if it's a duplicate (already reported for a different URL variant)
      const alreadyReported = missingRedirects.some(
        mr => mr.oldPath === renamedFile.oldPath && mr.newPath === renamedFile.newPath
      );

      if (!alreadyReported) {
        missingRedirects.push({
          oldPath: renamedFile.oldPath,
          newPath: renamedFile.newPath,
          oldUrl: renamedFile.oldUrl,
          newUrl: renamedFile.newUrl,
          isDeveloperDocs: renamedFile.isDeveloperDocs,
        });
      }
    }
  }

  return missingRedirects;
}

// Main execution
if (require.main === module) {
  const missingRedirects = validateRedirects();

  if (missingRedirects.length > 0) {
    console.error('\n❌ Missing redirects detected:');
    missingRedirects.forEach(mr => {
      console.error(`   ${mr.oldUrl} → ${mr.newUrl}`);
      console.error(`   File: ${mr.oldPath} → ${mr.newPath}`);
      console.error(
        `   Array: ${mr.isDeveloperDocs ? 'developerDocsRedirects' : 'userDocsRedirects'}\n`
      );
    });

    // Output JSON for GitHub Action
    console.log('\n---JSON_OUTPUT---');
    console.log(JSON.stringify({missingRedirects}, null, 2));
    console.log('---JSON_OUTPUT---\n');

    process.exit(1);
  } else {
    console.log('\n✅ All renamed files have corresponding redirects in redirects.js');
    process.exit(0);
  }
}

export {validateRedirects, filePathToUrls, parseRedirectsJs, redirectMatches};

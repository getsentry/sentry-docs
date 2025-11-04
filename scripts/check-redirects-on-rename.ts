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
    // Return canonical URL with trailing slash (Next.js has trailingSlash: true)
    return {isDeveloperDocs, urls: [`/${slug}/`]};
  }

  // Return canonical URL with trailing slash (Next.js has trailingSlash: true)
  return {isDeveloperDocs, urls: [`/${slug}/`]};
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

      // Create entry with canonical URL (Next.js normalizes to trailing slash)
      // Since trailingSlash: true is set, we only need one redirect per file pair
      renamedFiles.push({
        oldPath,
        newPath,
        oldUrl: oldPathInfo.urls[0], // Canonical URL (with trailing slash)
        newUrl: newPathInfo.urls[0], // Canonical URL (with trailing slash)
        isDeveloperDocs: oldPathInfo.isDeveloperDocs,
      });
    }

    return renamedFiles;
  } catch (error) {
    console.error('Error detecting renamed files:', error);
    return [];
  }
}

/**
 * Parses redirects.js to extract redirect entries by directly requiring the file
 */
function parseRedirectsJs(filePath: string): {
  developerDocsRedirects: Redirect[];
  userDocsRedirects: Redirect[];
} {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  redirects.js not found at ${filePath}`);
    return {developerDocsRedirects: [], userDocsRedirects: []};
  }

  try {
    // Clear require cache to ensure we get fresh data
    const resolvedPath = path.resolve(filePath);
    delete require.cache[resolvedPath];

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const redirects = require(resolvedPath);
    return {
      developerDocsRedirects: redirects.developerDocsRedirects || [],
      userDocsRedirects: redirects.userDocsRedirects || [],
    };
  } catch (error) {
    console.warn(`⚠️  Error loading redirects from ${filePath}:`, error);
    return {developerDocsRedirects: [], userDocsRedirects: []};
  }
}

/**
 * Escapes special regex characters in a string so they are treated as literals
 */
function escapeRegexSpecialChars(str: string): string {
  // Escape special regex characters: . * + ? ^ $ | ( ) [ ] { } \
  // We need to escape backslashes first, then other special chars
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts a redirect pattern with path parameters to a regex pattern
 * Escapes special regex characters while preserving path parameter patterns
 */
function convertRedirectPatternToRegex(pattern: string): string {
  // Strategy: Replace path parameters with placeholders first, escape everything,
  // then replace placeholders with regex patterns
  const placeholderPathStar = '__PATH_STAR_PLACEHOLDER__';
  const placeholderParam = '__PARAM_PLACEHOLDER__';

  // Replace path parameters with placeholders
  let result = pattern
    .replace(/:\w+\*/g, placeholderPathStar) // :path* -> placeholder
    .replace(/:\w+/g, placeholderParam); // :param -> placeholder

  // Escape all special regex characters
  result = escapeRegexSpecialChars(result);

  // Replace placeholders with regex patterns
  result = result
    .replace(new RegExp(escapeRegexSpecialChars(placeholderPathStar), 'g'), '.*') // placeholder -> .*
    .replace(new RegExp(escapeRegexSpecialChars(placeholderParam), 'g'), '[^/]+'); // placeholder -> [^/]+

  return result;
}

/**
 * Checks if a redirect matches the expected old → new URL pattern
 * Handles path parameters like :path*, :platform, etc.
 *
 * Important considerations for :path*:
 * 1. If a redirect uses :path* (e.g., /old/:path* -> /new/:path*), it matches
 *    any path under /old/ and redirects to the same path under /new/
 * 2. For a file rename, we need to verify that the redirect correctly maps
 *    the old URL to the new URL
 * 3. If the redirect destination doesn't match where the file actually moved,
 *    we need a specific redirect
 *
 * Examples:
 * - Redirect: /sdk/basics/:path* -> /sdk/processes/basics/:path*
 * - File: /sdk/basics/old.mdx -> /sdk/processes/basics/old.mdx ✅ Covered
 * - File: /sdk/basics/old.mdx -> /sdk/basics/new.mdx ❌ Needs specific redirect
 * - File: /sdk/basics/old.mdx -> /sdk/other/new.mdx ❌ Needs specific redirect
 */
function redirectMatches(redirect: Redirect, oldUrl: string, newUrl: string): boolean {
  // Simple exact match first
  if (redirect.source === oldUrl && redirect.destination === newUrl) {
    return true;
  }

  // Handle path parameters - convert patterns to regex
  // :path* matches zero or more path segments (including nested paths)
  // :param matches a single path segment
  const sourcePattern = convertRedirectPatternToRegex(redirect.source);
  const sourceRegex = new RegExp(`^${sourcePattern}$`);

  // Check if oldUrl matches the source pattern
  if (!sourceRegex.test(oldUrl)) {
    return false;
  }

  // Old URL matches the source pattern, now check if destination matches new URL
  const destPattern = convertRedirectPatternToRegex(redirect.destination);
  const destRegex = new RegExp(`^${destPattern}$`);

  // If destination has no path parameters, require exact match
  if (!redirect.destination.includes(':')) {
    return redirect.destination === newUrl;
  }

  // If destination has path parameters, check if newUrl matches the pattern
  // This handles cases like:
  // - /old/:path* -> /new/:path* where /old/file/ -> /new/file/ ✅
  // - /old/:path* -> /new/ where /old/file/ -> /new/ ✅
  // - /old/:path* -> /new/:path* where /old/file/ -> /other/file/ ❌
  //
  // Note: Next.js redirects preserve parameter values (e.g., /platforms/:platform/old
  // with request /platforms/javascript/old redirects to /platforms/javascript/new).
  // Our pattern matching doesn't extract and resolve parameter values, so we might
  // have false positives in edge cases where parameters differ between old and new URLs.
  // However, this is rare in practice (most renames preserve parameter values), and
  // the pattern match is a good heuristic that a redirect exists.
  return destRegex.test(newUrl);
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
      // Check if this file pair has already been reported
      // Since we only generate one URL variant per file (canonical with trailing slash),
      // we can deduplicate by file paths
      const alreadyReported = missingRedirects.some(
        mr =>
          mr.oldPath === renamedFile.oldPath &&
          mr.newPath === renamedFile.newPath &&
          mr.isDeveloperDocs === renamedFile.isDeveloperDocs
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

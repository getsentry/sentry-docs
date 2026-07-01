/**
 * Lint redirect chains: detects multi-hop redirects and content links
 * pointing to redirect sources.
 *
 * Phase 1: Finds redirect-to-redirect chains in middleware.ts and redirects.js
 *          (where redirect A's destination is another redirect B's source).
 * Phase 2: Finds internal links in .mdx content files that point to URLs
 *          which are redirect sources (and should point to the final destination).
 *
 * Outputs structured JSON for the GitHub Action workflow to post as a PR comment.
 */
import fs from 'fs';
import path from 'path';

import {parseMiddlewareTs, parseRedirectsJs} from './check-redirects-on-rename';

interface Redirect {
  destination: string;
  source: string;
}

interface RedirectChain {
  chain: string[];
  currentDest: string;
  file: string;
  finalDest: string;
  isDeveloperDocs: boolean;
  source: string;
}

interface ContentLinkIssue {
  filePath: string;
  finalDest: string;
  isDeveloperDocs: boolean;
  line: number;
  linkPath: string;
}

/**
 * Recursively finds all .mdx and .md files in the given directories
 */
function findAllMdxFiles(dirs: string[]): string[] {
  const files: string[] = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    const walk = (d: string) => {
      for (const entry of fs.readdirSync(d, {withFileTypes: true})) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
          files.push(full);
        }
      }
    };
    walk(dir);
  }
  return files;
}

/**
 * Walks a redirect chain to its final destination.
 * Returns the full chain path including the starting source.
 * Detects cycles and caps at maxDepth to prevent infinite loops.
 */
function walkChain(
  source: string,
  redirectMap: Map<string, string>,
  maxDepth = 10
): string[] {
  const chain = [source];
  let current = source;
  const seen = new Set<string>();
  seen.add(current);
  let depth = 0;
  while (redirectMap.has(current) && depth < maxDepth) {
    const next = redirectMap.get(current)!;
    if (seen.has(next)) {
      chain.push(next + ' (CYCLE)');
      break;
    }
    seen.add(next);
    chain.push(next);
    current = next;
    depth++;
  }
  return chain;
}

/**
 * Resolves a path through the redirect map to its final destination.
 */
function resolveToFinal(source: string, map: Map<string, string>): string {
  let current = source;
  const seen = new Set<string>();
  while (map.has(current) && !seen.has(current)) {
    seen.add(current);
    current = map.get(current)!;
  }
  return current;
}

/**
 * Phase 1: Detect redirect-to-redirect chains
 */
function detectRedirectChains(
  jsRedirects: {developerDocsRedirects: Redirect[]; userDocsRedirects: Redirect[]},
  mwRedirects: {developerDocsRedirects: Redirect[]; userDocsRedirects: Redirect[]}
): RedirectChain[] {
  const chains: RedirectChain[] = [];

  for (const docType of ['user', 'developer'] as const) {
    const isDevDocs = docType === 'developer';
    const jsArr = isDevDocs
      ? jsRedirects.developerDocsRedirects
      : jsRedirects.userDocsRedirects;
    const mwArr = isDevDocs
      ? mwRedirects.developerDocsRedirects
      : mwRedirects.userDocsRedirects;

    // Build unified map for chain detection
    const allRedirects = [...jsArr, ...mwArr];
    const redirectMap = new Map<string, string>();
    for (const r of allRedirects) {
      redirectMap.set(r.source, r.destination);
    }

    // Track which file each source comes from
    const jsSourceSet = new Set(jsArr.map(r => r.source));

    // Find chains
    const seenSources = new Set<string>();
    for (const r of allRedirects) {
      if (seenSources.has(r.source)) {
        continue;
      }
      seenSources.add(r.source);

      if (redirectMap.has(r.destination)) {
        const chain = walkChain(r.source, redirectMap);
        const finalDest = chain[chain.length - 1];

        // Skip self-referencing cycles
        if (finalDest === r.source || finalDest.includes('(CYCLE)')) {
          chains.push({
            source: r.source,
            currentDest: r.destination,
            finalDest: '(CYCLE DETECTED)',
            chain,
            file: jsSourceSet.has(r.source) ? 'redirects.js' : 'middleware.ts',
            isDeveloperDocs: isDevDocs,
          });
          continue;
        }

        chains.push({
          source: r.source,
          currentDest: r.destination,
          finalDest,
          chain,
          file: jsSourceSet.has(r.source) ? 'redirects.js' : 'middleware.ts',
          isDeveloperDocs: isDevDocs,
        });
      }
    }
  }

  return chains;
}

/**
 * Phase 2: Detect content links pointing to redirect sources
 */
function detectContentLinkIssues(
  jsRedirects: {developerDocsRedirects: Redirect[]; userDocsRedirects: Redirect[]},
  mwRedirects: {developerDocsRedirects: Redirect[]; userDocsRedirects: Redirect[]}
): ContentLinkIssue[] {
  // Build redirect maps
  const userRedirectMap = new Map<string, string>();
  for (const r of [...jsRedirects.userDocsRedirects, ...mwRedirects.userDocsRedirects]) {
    userRedirectMap.set(r.source, r.destination);
  }
  const devRedirectMap = new Map<string, string>();
  for (const r of [
    ...jsRedirects.developerDocsRedirects,
    ...mwRedirects.developerDocsRedirects,
  ]) {
    devRedirectMap.set(r.source, r.destination);
  }

  const mdxFiles = findAllMdxFiles([
    'docs',
    'develop-docs',
    'includes',
    'platform-includes',
  ]);

  // Regex patterns for extracting internal links
  // Markdown: [text](/path/) or [text](/path/#anchor)
  const markdownLinkRegex = /\]\((\/[^)#\s]+?)(?:#[^)]+)?\)/g;
  // JSX: href="/path/", to="/path/", or url="/path/"
  const jsxLinkRegex = /((?:href|to|url))="(\/[^"#]+?)(?:#[^"]+)?"/g;

  const issues: ContentLinkIssue[] = [];

  for (const filePath of mdxFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const isDevDocsFile = filePath.startsWith('develop-docs/');
    const map = isDevDocsFile ? devRedirectMap : userRedirectMap;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if this line contains a PlatformLink tag (platform-relative paths)
      const isPlatformLinkLine = line.includes('<PlatformLink');

      for (const regex of [markdownLinkRegex, jsxLinkRegex]) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
          // For jsxLinkRegex, capture group 1 is the attribute name, group 2 is the path
          // For markdownLinkRegex, capture group 1 is the path
          const isJsxMatch = regex === jsxLinkRegex;
          const attrName = isJsxMatch ? match[1] : null;
          let linkPath = isJsxMatch ? match[2] : match[1];

          // Skip PlatformLink to= attributes since PlatformLink prepends
          // the platform base URL, making them platform-relative paths
          if (isPlatformLinkLine && attrName === 'to') {
            continue;
          }
          // Normalize: ensure trailing slash for lookup
          const normalizedPath = linkPath.endsWith('/') ? linkPath : linkPath + '/';

          // Check both with and without trailing slash, since some redirect
          // sources in redirects.js omit trailing slashes
          const matchedPath = map.has(normalizedPath)
            ? normalizedPath
            : map.has(linkPath)
              ? linkPath
              : null;

          if (matchedPath) {
            const finalDest = resolveToFinal(matchedPath, map);
            issues.push({
              filePath,
              line: i + 1,
              linkPath: matchedPath,
              finalDest,
              isDeveloperDocs: isDevDocsFile,
            });
          }
        }
      }
    }
  }

  return issues;
}

// Main execution
if (require.main === module) {
  console.log('Linting redirect chains...\n');

  const jsRedirects = parseRedirectsJs('redirects.js');
  const mwRedirects = parseMiddlewareTs('middleware.ts');

  console.log(
    `Parsed: ${jsRedirects.userDocsRedirects.length + jsRedirects.developerDocsRedirects.length} from redirects.js, ` +
      `${mwRedirects.userDocsRedirects.length + mwRedirects.developerDocsRedirects.length} from middleware.ts`
  );

  // Phase 1: Redirect chains
  const chains = detectRedirectChains(jsRedirects, mwRedirects);
  if (chains.length > 0) {
    console.log(`\n❌ Found ${chains.length} redirect chain(s):\n`);
    for (const c of chains) {
      console.log(`  [${c.file}] ${c.chain.join(' -> ')}`);
      console.log(`    Fix: Change destination of "${c.source}" to "${c.finalDest}"`);
    }
  } else {
    console.log('\n✅ No redirect chains found.');
  }

  // Phase 2: Content links
  const contentIssues = detectContentLinkIssues(jsRedirects, mwRedirects);
  if (contentIssues.length > 0) {
    console.log(
      `\n❌ Found ${contentIssues.length} content link(s) pointing to redirect sources:\n`
    );

    // Group by file for readable output
    const byFile = new Map<string, ContentLinkIssue[]>();
    for (const issue of contentIssues) {
      const arr = byFile.get(issue.filePath) || [];
      arr.push(issue);
      byFile.set(issue.filePath, arr);
    }

    for (const [file, fileIssues] of byFile) {
      console.log(`  ${file}:`);
      for (const issue of fileIssues) {
        console.log(
          `    L${issue.line}: ${issue.linkPath} -> should be ${issue.finalDest}`
        );
      }
    }
  } else {
    console.log('\n✅ No content links pointing to redirect sources.');
  }

  // Summary and JSON output
  const hasIssues = chains.length > 0 || contentIssues.length > 0;

  if (hasIssues) {
    console.log('\n---JSON_OUTPUT---');
    console.log(
      JSON.stringify(
        {
          redirectChains: chains,
          contentLinkIssues: contentIssues,
        },
        null,
        2
      )
    );
    console.log('---JSON_OUTPUT---\n');

    process.exit(1);
  } else {
    console.log(
      '\n✅ All clear: no redirect chains or content links pointing to redirect sources.'
    );
    process.exit(0);
  }
}

export {
  detectContentLinkIssues,
  detectRedirectChains,
  findAllMdxFiles,
  resolveToFinal,
  walkChain,
};

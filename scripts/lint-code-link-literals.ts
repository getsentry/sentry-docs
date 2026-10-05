/**
 * Lint internal site paths written as string literals in application code.
 *
 * `next.config.ts` sets `trailingSlash: true`, so a link rendered without a
 * trailing slash is served a 308 before the page loads. The content linter
 * (`lint-trailing-slashes.ts`) only reads `docs/` and friends, so paths living
 * in components were invisible to it -- and a component renders on many pages,
 * which makes each one disproportionately costly. `featureInfo.tsx` alone held
 * six.
 *
 * This is report-only, deliberately. A slash-prefixed literal in code is not
 * reliably a link: `internalLinkTracking.ts` documents its own normalization
 * with `/product/logs` inside a comment, and rewriting that would corrupt the
 * documentation rather than fix a redirect. Each hit needs a human to decide
 * whether it is a link, so there is no `--fix`.
 */
import fs from 'fs';
import path from 'path';

const CODE_DIRS = ['src', 'app'];
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

/** A quoted, slash-prefixed path with at least two segments. */
const PATH_LITERAL = /["'`](\/(?!\/)[a-z0-9][a-zA-Z0-9/_-]*)["'`]/g;

/** Paths that address a file rather than a page. */
const FILE_EXTENSION =
  /\.(pdf|png|jpg|jpeg|gif|svg|json|xml|txt|zip|ico|webp|mp4|css|js|woff2?)$/i;

/**
 * Not trailing-slash-normalized pages: the REST API, Next internals, assets,
 * and the Open Graph image routes.
 */
const NON_PAGE_PREFIXES = ['/api/0/', '/_', '/pdfs/', '/og-images/'];

/** Versioned pages serve 200 without a trailing slash and 308 with one. */
const VERSIONED_PAGE = /__v[0-9][0-9A-Za-z._-]*$/;

const IGNORE_MARKER = /trailing-slash-ignore/;

/**
 * A path inside a comment is documentation, not a rendered link.
 * `internalLinkTracking.ts` describes its own normalization with
 * "`/product/logs` and `/product/logs/` both become `/product/logs/`" --
 * reporting that would invite someone to "fix" the prose.
 */
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*)/;

export interface CodeLinkIssue {
  filePath: string;
  line: number;
  linkPath: string;
  suggested: string;
}

export function isExempt(linkPath: string): boolean {
  return (
    linkPath.endsWith('/') ||
    FILE_EXTENSION.test(linkPath) ||
    VERSIONED_PAGE.test(linkPath) ||
    NON_PAGE_PREFIXES.some(prefix => linkPath.startsWith(prefix)) ||
    // A single segment (`/platforms`) is usually a prefix being built up or
    // compared rather than a link, and is too noisy to report.
    linkPath.split('/').filter(Boolean).length < 2
  );
}

export function findIssuesInSource(content: string, filePath: string): CodeLinkIssue[] {
  const issues: CodeLinkIssue[] = [];
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // The marker exempts its own line and the one after it, matching
    // lint-trailing-slashes.ts, so it can sit above the line it applies to.
    if (
      COMMENT_LINE.test(line) ||
      IGNORE_MARKER.test(line) ||
      (index > 0 && IGNORE_MARKER.test(lines[index - 1]))
    ) {
      return;
    }
    PATH_LITERAL.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = PATH_LITERAL.exec(line)) !== null) {
      const linkPath = match[1];
      if (isExempt(linkPath)) {
        continue;
      }
      issues.push({
        filePath,
        line: index + 1,
        linkPath,
        suggested: `${linkPath}/`,
      });
    }
  });
  return issues;
}

function findSourceFiles(dirs: string[]): string[] {
  const files: string[] = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    const walk = (d: string) => {
      for (const entry of fs.readdirSync(d, {withFileTypes: true})) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
            continue;
          }
          walk(full);
        } else if (
          CODE_EXTENSIONS.includes(path.extname(entry.name)) &&
          !/\.(spec|test)\.[jt]sx?$/.test(entry.name)
        ) {
          files.push(full);
        }
      }
    };
    walk(dir);
  }
  return files;
}

export function lintCodeLinkLiterals(): CodeLinkIssue[] {
  const issues: CodeLinkIssue[] = [];
  for (const filePath of findSourceFiles(CODE_DIRS)) {
    issues.push(...findIssuesInSource(fs.readFileSync(filePath, 'utf8'), filePath));
  }
  return issues;
}

// Main execution
if (require.main === module) {
  console.log('Linting internal path literals in application code...\n');
  const issues = lintCodeLinkLiterals();

  if (issues.length === 0) {
    console.log('✅ No internal path literals missing a trailing slash.');
    process.exit(0);
  }

  console.log(
    `❌ Found ${issues.length} internal path literal(s) missing a trailing slash:\n`
  );
  const byFile = new Map<string, CodeLinkIssue[]>();
  for (const issue of issues) {
    const arr = byFile.get(issue.filePath) || [];
    arr.push(issue);
    byFile.set(issue.filePath, arr);
  }
  for (const [file, fileIssues] of byFile) {
    console.log(`  ${file}:`);
    for (const issue of fileIssues) {
      console.log(`    L${issue.line}: ${issue.linkPath} -> ${issue.suggested}`);
    }
  }

  console.log(
    '\nThese are reported, not fixed: a slash-prefixed literal in code is not\n' +
      'always a link. Check each one, then either add the slash or mark the line\n' +
      'with a `trailing-slash-ignore` comment.'
  );
  process.exit(1);
}

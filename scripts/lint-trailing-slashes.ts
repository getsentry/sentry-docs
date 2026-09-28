/**
 * Lint internal links for missing trailing slashes.
 *
 * `next.config.ts` sets `trailingSlash: true`, so an internal link written
 * without a trailing slash is served a 308 redirect before the page loads.
 * That costs latency on every click and dilutes link equity, so links should
 * be authored in their canonical, already-redirected form.
 *
 * Run `--fix` to rewrite the offending links in place.
 *
 * Outputs structured JSON for the GitHub Action workflow to post as a PR comment.
 */
import fs from 'fs';

import {findAllMdxFiles} from './lint-redirect-chains';

export interface TrailingSlashIssue {
  column: number;
  filePath: string;
  line: number;
  linkPath: string;
  suggested: string;
}

const CONTENT_DIRS = ['docs', 'develop-docs', 'includes', 'platform-includes'];

/**
 * Attributes whose value is a site URL. Other attributes that happen to hold a
 * slash-prefixed string (includePath, path, endpoint, and env vars inside code
 * samples) are filesystem paths or config values, not links, and must be left
 * alone.
 */
const URL_ATTRIBUTES = ['href', 'to', 'url'];

/** Markdown: [text](/path), [text](/path#anchor), [text](/path "title") */
const MARKDOWN_LINK = /(\]\()(\/[^)\s#]*)(#[^)\s]*)?((?:\s+"[^"]*")?\))/g;

/** JSX: href="/path", to='/path', url="/path#anchor" */
const JSX_LINK = new RegExp(
  `((?:${URL_ATTRIBUTES.join('|')})=)(["'])(\\/[^"'#\\s]*)(#[^"']*)?\\2`,
  'g'
);

/** Paths that address a file rather than a page. */
const FILE_EXTENSION =
  /\.(pdf|png|jpg|jpeg|gif|svg|json|xml|txt|zip|ico|webp|mp4|css|js|yaml|yml|toml|csv)$/i;

/** Asset and API routes that are not trailing-slash normalized. */
const NON_PAGE_PREFIXES = ['/pdfs/', '/_', '/api/0/'];

/**
 * Versioned pages (`/manual-setup__v10.7.0`) invert the rule: they are served
 * with a 200 *without* a trailing slash and a 308 *with* one, so adding a
 * slash there would introduce a redirect hop rather than remove one.
 */
const VERSIONED_PAGE = /__v[0-9][0-9A-Za-z._-]*$/;

const FENCE = /^\s*(```|~~~)/;

/** Returns true when the path should keep whatever form it already has. */
export function isExempt(linkPath: string): boolean {
  return (
    linkPath === '' ||
    linkPath.endsWith('/') ||
    FILE_EXTENSION.test(linkPath) ||
    VERSIONED_PAGE.test(linkPath) ||
    NON_PAGE_PREFIXES.some(prefix => linkPath.startsWith(prefix))
  );
}

/**
 * Blanks out inline code spans so links quoted inside backticks are not
 * treated as real links. Length is preserved so match offsets stay valid.
 */
export function maskInlineCode(line: string): string {
  return line.replace(/`[^`]*`/g, match => ' '.repeat(match.length));
}

/**
 * Finds every link on a single line that is missing a trailing slash, and
 * returns the corrected line alongside the issues found.
 */
function processLine(
  line: string,
  lineNumber: number,
  filePath: string
): {fixed: string; issues: TrailingSlashIssue[]} {
  const issues: TrailingSlashIssue[] = [];
  const masked = maskInlineCode(line);

  // Collect replacements against the masked line, then apply them to the real
  // line from right to left so earlier offsets stay valid.
  const edits: Array<{end: number; start: number; text: string}> = [];

  for (const regex of [MARKDOWN_LINK, JSX_LINK]) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(masked)) !== null) {
      const isJsx = regex === JSX_LINK;
      const linkPath = isJsx ? match[3] : match[2];
      const fragment = (isJsx ? match[4] : match[3]) ?? '';

      if (isExempt(linkPath)) {
        continue;
      }

      const suggested = `${linkPath}/`;
      const replacement = isJsx
        ? `${match[1]}${match[2]}${suggested}${fragment}${match[2]}`
        : `${match[1]}${suggested}${fragment}${match[4]}`;

      edits.push({
        start: match.index,
        end: match.index + match[0].length,
        text: replacement,
      });
      issues.push({
        filePath,
        line: lineNumber,
        column: match.index + 1,
        linkPath: linkPath + fragment,
        suggested: suggested + fragment,
      });
    }
  }

  edits.sort((a, b) => b.start - a.start);
  let fixed = line;
  for (const edit of edits) {
    fixed = fixed.slice(0, edit.start) + edit.text + fixed.slice(edit.end);
  }

  return {fixed, issues};
}

/**
 * Scans a file's contents for links missing a trailing slash. Lines inside
 * fenced code blocks are skipped, since those are samples rather than links.
 */
export function findIssuesInContent(
  content: string,
  filePath: string
): {fixed: string; issues: TrailingSlashIssue[]} {
  const lines = content.split('\n');
  const issues: TrailingSlashIssue[] = [];
  let inFence = false;

  const fixedLines = lines.map((line, index) => {
    if (FENCE.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) {
      return line;
    }
    const result = processLine(line, index + 1, filePath);
    issues.push(...result.issues);
    return result.fixed;
  });

  return {fixed: fixedLines.join('\n'), issues};
}

/** Restricts an explicit file list to content files that actually exist. */
function selectFiles(explicitFiles: string[]): string[] {
  if (explicitFiles.length === 0) {
    return findAllMdxFiles(CONTENT_DIRS);
  }
  return explicitFiles.filter(
    file =>
      /\.mdx?$/.test(file) &&
      CONTENT_DIRS.some(dir => file === dir || file.startsWith(`${dir}/`)) &&
      fs.existsSync(file)
  );
}

/**
 * Scans content files. When `files` is empty every content file is scanned;
 * otherwise only the given paths are. When `fix` is set, offending files are
 * rewritten in place and their paths are returned.
 */
export function lintTrailingSlashes(
  fix = false,
  files: string[] = []
): {
  fixedFiles: string[];
  issues: TrailingSlashIssue[];
} {
  const issues: TrailingSlashIssue[] = [];
  const fixedFiles: string[] = [];

  for (const filePath of selectFiles(files)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = findIssuesInContent(content, filePath);
    if (result.issues.length === 0) {
      continue;
    }
    issues.push(...result.issues);
    if (fix && result.fixed !== content) {
      fs.writeFileSync(filePath, result.fixed, 'utf8');
      fixedFiles.push(filePath);
    }
  }

  return {issues, fixedFiles};
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix');
  // Remaining arguments are explicit file paths, as passed by pre-commit.
  const files = args.filter(arg => !arg.startsWith('-'));

  console.log(
    fix
      ? 'Fixing internal links missing trailing slashes...\n'
      : 'Linting internal links for missing trailing slashes...\n'
  );

  const {issues, fixedFiles} = lintTrailingSlashes(fix, files);

  if (issues.length === 0) {
    console.log('✅ All internal links use trailing slashes.');
    process.exit(0);
  }

  if (fix) {
    console.log(`✅ Fixed ${issues.length} link(s) across ${fixedFiles.length} file(s).`);
    for (const file of fixedFiles) {
      console.log(`  ${file}`);
    }
    process.exit(0);
  }

  console.log(`❌ Found ${issues.length} internal link(s) missing a trailing slash:\n`);

  const byFile = new Map<string, TrailingSlashIssue[]>();
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

  console.log('\nRun `pnpm lint:trailing-slash:fix` to fix these automatically.');

  console.log('\n---JSON_OUTPUT---');
  console.log(JSON.stringify({trailingSlashIssues: issues}, null, 2));
  console.log('---JSON_OUTPUT---\n');

  process.exit(1);
}

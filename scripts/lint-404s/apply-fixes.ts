import {randomUUID} from 'node:crypto';
import {constants} from 'node:fs';
import {open, readFile, rename, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {createProcessor} from '@mdx-js/mdx';
import {visit} from 'unist-util-visit';

export type LinkFix = {
  file: string;
  newUrl: string;
  oldUrl: string;
};

type LinkFixes = {fixes: LinkFix[]};

const allowedFile = /^(?:docs|includes|platform-includes)\/.+\.mdx?$/;
const safeReplacementUrl = /^\/(?!\/)[A-Za-z0-9._~/%:@!$&*+,;=?#-]*$/;

export function validateFix(fix: LinkFix): void {
  if (
    typeof fix.file !== 'string' ||
    typeof fix.oldUrl !== 'string' ||
    typeof fix.newUrl !== 'string'
  ) {
    throw new Error('Link fix fields must be strings.');
  }
  if (
    !allowedFile.test(fix.file) ||
    path.isAbsolute(fix.file) ||
    path.posix.normalize(fix.file) !== fix.file
  ) {
    throw new Error(`Disallowed documentation path: ${fix.file}`);
  }
  if (
    !fix.oldUrl ||
    !fix.newUrl ||
    fix.oldUrl === fix.newUrl ||
    /[\r\n]/.test(fix.oldUrl) ||
    !safeReplacementUrl.test(fix.newUrl)
  ) {
    throw new Error(`Unsafe URL replacement in ${fix.file}`);
  }
}

export function replaceLinkDestinations(content: string, fix: LinkFix): string {
  validateFix(fix);
  const ranges: Array<{end: number; start: number}> = [];
  const frontmatterEnd =
    content.match(/^---\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)\r?\n/)?.[0].length ?? 0;
  const tree = createProcessor({format: 'mdx'}).parse(content);

  visit(tree, node => {
    if (node.type === 'link' && node.url === fix.oldUrl && node.position) {
      const start = node.position.start.offset;
      const end = node.position.end.offset;
      if (start === undefined || end === undefined || start < frontmatterEnd) {
        return;
      }
      const source = content.slice(start, end);
      const markdownDestination = `(${fix.oldUrl})`;
      const autolinkDestination = `<${fix.oldUrl}>`;
      if (source.endsWith(markdownDestination)) {
        ranges.push({
          start: end - markdownDestination.length + 1,
          end: end - 1,
        });
      } else if (source === autolinkDestination) {
        ranges.push({start: start + 1, end: end - 1});
      }
      return;
    }

    if (
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      node.attributes
    ) {
      for (const attribute of node.attributes) {
        if (
          attribute.type !== 'mdxJsxAttribute' ||
          (attribute.name !== 'href' && attribute.name !== 'to') ||
          attribute.value !== fix.oldUrl ||
          !attribute.position
        ) {
          continue;
        }
        const start = attribute.position.start.offset;
        const end = attribute.position.end.offset;
        if (start === undefined || end === undefined || start < frontmatterEnd) {
          continue;
        }
        const source = content.slice(start, end);
        const doubleQuoted = `"${fix.oldUrl}"`;
        const singleQuoted = `'${fix.oldUrl}'`;
        const destination = source.includes(doubleQuoted) ? doubleQuoted : singleQuoted;
        const destinationStart = source.indexOf(destination);
        if (destinationStart !== -1) {
          ranges.push({
            start: start + destinationStart + 1,
            end: start + destinationStart + destination.length - 1,
          });
        }
      }
    }
  });

  if (ranges.length === 0) {
    throw new Error(`URL is not an exact link destination in ${fix.file}: ${fix.oldUrl}`);
  }

  for (const range of ranges.sort((a, b) => b.start - a.start)) {
    if (content.slice(range.start, range.end) !== fix.oldUrl) {
      throw new Error(`Link destination changed while applying fix in ${fix.file}`);
    }
    content = content.slice(0, range.start) + fix.newUrl + content.slice(range.end);
  }
  return content;
}

export async function applyFixes(
  input: LinkFixes,
  root = process.cwd()
): Promise<string[]> {
  if (
    !Array.isArray(input.fixes) ||
    input.fixes.length === 0 ||
    input.fixes.length > 50
  ) {
    throw new Error('Expected between 1 and 50 link fixes.');
  }

  const fixesByFile = new Map<string, LinkFix[]>();
  const seen = new Set<string>();
  for (const fix of input.fixes) {
    validateFix(fix);
    const key = `${fix.file}\0${fix.oldUrl}`;
    if (seen.has(key)) {
      throw new Error(`Duplicate link fix: ${fix.file} ${fix.oldUrl}`);
    }
    seen.add(key);
    const fileFixes = fixesByFile.get(fix.file) ?? [];
    fileFixes.push(fix);
    fixesByFile.set(fix.file, fileFixes);
  }

  for (const [file, fixes] of fixesByFile) {
    const oldUrls = new Set(fixes.map(fix => fix.oldUrl));
    for (const fix of fixes) {
      if (oldUrls.has(fix.newUrl)) {
        throw new Error(`Chained link fixes are not allowed in ${file}: ${fix.newUrl}`);
      }
    }
  }

  for (const [file, fixes] of fixesByFile) {
    const absolutePath = path.resolve(root, file);
    const relativePath = path.relative(root, absolutePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new Error(`Link fix escapes the repository: ${file}`);
    }

    const handle = await open(absolutePath, constants.O_RDONLY | constants.O_NOFOLLOW);
    let mode: number;
    let updated: string;
    try {
      const stats = await handle.stat();
      if (!stats.isFile()) {
        throw new Error(`Link fix target must be a regular file: ${file}`);
      }

      mode = stats.mode;
      updated = await handle.readFile('utf8');
      for (const fix of fixes) {
        updated = replaceLinkDestinations(updated, fix);
      }
    } finally {
      await handle.close();
    }

    const temporaryPath = `${absolutePath}.lint-404-${randomUUID()}.tmp`;
    try {
      const temporaryHandle = await open(
        temporaryPath,
        constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW,
        mode
      );
      try {
        await temporaryHandle.writeFile(updated, 'utf8');
        await temporaryHandle.sync();
      } finally {
        await temporaryHandle.close();
      }
      await rename(temporaryPath, absolutePath);
    } catch (error) {
      await rm(temporaryPath, {force: true});
      throw error;
    }
  }

  return [...fixesByFile.keys()];
}

async function main(): Promise<void> {
  const inputIndex = process.argv.indexOf('--input');
  const inputPath = inputIndex === -1 ? undefined : process.argv[inputIndex + 1];
  if (!inputPath) {
    throw new Error('Usage: tsx apply-fixes.ts --input <proposals.json>');
  }

  const input = JSON.parse(await readFile(inputPath, 'utf8')) as LinkFixes;
  const changedFiles = await applyFixes(input);
  process.stdout.write(`${changedFiles.join('\n')}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

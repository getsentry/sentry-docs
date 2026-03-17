import {createHash} from 'node:crypto';
import {copyFileSync, existsSync, mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {visit} from 'unist-util-visit';

/**
 * Copy all relative images referenced in an MDX source string to outdir.
 * This runs BEFORE the MDX cache check so images exist even on cache hits.
 *
 * @param {string} source - Raw MDX source content
 * @param {string} sourceFolder - Directory containing the MDX file
 * @param {string} outdir - Output directory (e.g. public/mdx-images)
 */
export function copyImagesFromSource(source, sourceFolder, outdir) {
  mkdirSync(outdir, {recursive: true});

  // Match markdown image syntax: ![...](./relative/path.ext)
  const imageRegex = /!\[[^\]]*\]\((\.[^)]+)\)/g;
  let match;
  while ((match = imageRegex.exec(source)) !== null) {
    const rawUrl = match[1];
    const cleanUrl = rawUrl.split('?')[0].split('#')[0];

    // Skip non-relative
    if (!cleanUrl.startsWith('./') && !cleanUrl.startsWith('../')) {
      continue;
    }

    const srcPath = path.resolve(sourceFolder, cleanUrl);
    if (!existsSync(srcPath)) {
      continue;
    }

    const content = readFileSync(srcPath);
    const hash = createHash('md5').update(content).digest('hex').slice(0, 8);
    const ext = path.extname(cleanUrl);
    const basename = path.basename(cleanUrl, ext);
    const destPath = path.join(outdir, `${basename}-${hash.toUpperCase()}${ext}`);

    if (!existsSync(destPath)) {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Remark plugin that rewrites relative image URLs to content-hashed filenames
 * in public/mdx-images/. Also copies images (idempotent — skips if exists).
 *
 * Images stay as regular markdown `image` AST nodes (no import conversion).
 * The DocImage component handles `./` prefix → `/mdx-images/` resolution.
 *
 * @param {Object} options
 * @param {string} options.sourceFolder - Directory containing the MDX file
 * @param {string} options.outdir - Output directory for copied images
 */
export default function remarkCopyImages({sourceFolder, outdir}) {
  mkdirSync(outdir, {recursive: true});

  return tree => {
    visit(tree, 'image', node => {
      const {url} = node;

      // Skip external URLs and absolute paths
      if (
        url.startsWith('http') ||
        url.startsWith('//') ||
        url.startsWith('/') ||
        url.startsWith('data:')
      ) {
        return;
      }

      // Strip query params and hash to get the actual file path
      const cleanUrl = url.split('?')[0].split('#')[0];
      const srcPath = path.resolve(sourceFolder, cleanUrl);

      if (!existsSync(srcPath)) {
        return;
      }

      const content = readFileSync(srcPath);
      const hash = createHash('md5').update(content).digest('hex').slice(0, 8);
      const ext = path.extname(cleanUrl);
      const basename = path.basename(cleanUrl, ext);
      const hashedName = `${basename}-${hash.toUpperCase()}${ext}`;

      // Copy (idempotent)
      const destPath = path.join(outdir, hashedName);
      if (!existsSync(destPath)) {
        copyFileSync(srcPath, destPath);
      }

      // Preserve query params and hash from the original URL
      const queryStart = url.indexOf('?');
      const hashStart = url.indexOf('#');
      let suffix = '';
      if (queryStart !== -1) {
        suffix = url.slice(queryStart);
      } else if (hashStart !== -1) {
        suffix = url.slice(hashStart);
      }

      // Rewrite URL — DocImage resolves ./ → /mdx-images/
      node.url = `./${hashedName}${suffix}`;
    });
  };
}

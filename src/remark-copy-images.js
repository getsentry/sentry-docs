import {createHash} from 'node:crypto';
import {copyFileSync, existsSync, mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {visit} from 'unist-util-visit';

/**
 * Remark plugin that copies relative images to public/mdx-images/ with
 * content-hashed filenames. Replaces remarkMdxImages + esbuild file loader.
 *
 * Images stay as regular markdown `image` AST nodes (no import conversion).
 * The DocImage component handles `./` prefix → `/mdx-images/` resolution.
 *
 * @param {Object} options
 * @param {string} options.sourceFolder - Directory containing the MDX file (for resolving relative paths)
 * @param {string} options.outdir - Output directory for copied images (e.g. public/mdx-images)
 */
export default function remarkCopyImages({sourceFolder, outdir}) {
  // Ensure output directory exists
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

      // Resolve the absolute path to the source image
      const srcPath = path.resolve(sourceFolder, cleanUrl);

      if (!existsSync(srcPath)) {
        // Don't fail the build for missing images — they'll 404 at runtime
        return;
      }

      // Read file and compute content hash
      const content = readFileSync(srcPath);
      const hash = createHash('md5').update(content).digest('hex').slice(0, 8);

      // Build hashed filename: originalname-HASH.ext
      const ext = path.extname(cleanUrl);
      const basename = path.basename(cleanUrl, ext);
      const hashedName = `${basename}-${hash.toUpperCase()}${ext}`;

      // Copy to outdir
      const destPath = path.join(outdir, hashedName);
      if (!existsSync(destPath)) {
        copyFileSync(srcPath, destPath);
      }

      // Preserve query params and hash from the original URL (e.g. ?v=abc#600x400)
      const queryStart = url.indexOf('?');
      const hashStart = url.indexOf('#');
      let suffix = '';
      if (queryStart !== -1) {
        suffix = url.slice(queryStart);
      } else if (hashStart !== -1) {
        suffix = url.slice(hashStart);
      }

      // Rewrite URL to relative path in outdir — DocImage resolves ./ → /mdx-images/
      node.url = `./${hashedName}${suffix}`;
    });
  };
}

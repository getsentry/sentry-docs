import path from 'path';

import getImageSize from 'image-size';
import {visit} from 'unist-util-visit';

const POSIX_SEP = '/';

const toPosix = value => value.split(path.sep).join(POSIX_SEP);

/**
 * Appends the image dimensions to the url hash so DocImage can pass them to next/image.
 * Relative asset paths are also rewritten to `/mdx-images/<relative-path-from-root>` so
 * they can be served directly from the docs directory without relying on mdx-bundler.
 */
export default function remarkImageSize(options) {
  const {docDir = '', publicFolder, root, sourceFolder} = options;

  return tree =>
    visit(tree, 'image', node => {
      if (!node.url) {
        return;
      }

      if (node.url.startsWith('http') || node.url.startsWith('//')) {
        return;
      }

      try {
        if (node.url.startsWith('/')) {
          const fullImagePath = path.join(publicFolder, node.url);
          const {width, height} = getImageSize(fullImagePath);
          node.url = `${node.url}#${width}x${height}`;
          return;
        }

        const normalizedDocDir = docDir ? `${toPosix(docDir)}` : '';
        const resolvedRelativePath = path.posix.normalize(
          path.posix.join(normalizedDocDir, node.url)
        );

        if (resolvedRelativePath.startsWith('../')) {
          // Prevent leaking paths outside of the docs roots.
          return;
        }

        const absolutePath = path.join(root, resolvedRelativePath);
        const {width, height} = getImageSize(absolutePath);
        const relativePathFromRoot = toPosix(path.relative(root, absolutePath));

        node.url = `/mdx-images/${relativePathFromRoot}#${width}x${height}`;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Failed to determine image size for ${node.url}:`, error);
      }
    });
}

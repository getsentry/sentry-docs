import path from 'path';

import getImageSize from 'image-size';
import {visit} from 'unist-util-visit';

/**
 * Appends the image size to the image url as a hash e.g. /img.png -> /img.png#100x100
 * and resolves all local image paths to /mdx-images/... at build time.
 * Uses the full relative path from the MDX file to the image, encoded to avoid collisions.
 * This ensures deterministic, absolute image paths for hydration safety.
 *
 * Requires options.mdxFilePath to be set to the absolute path of the current MDX file.
 */
export default function remarkImageSize(options) {
  return tree =>
    visit(tree, 'image', node => {
      // Remote images: leave as-is
      if (node.url.startsWith('http')) {
        return;
      }

      // Public images (start with /): ensure absolute
      if (node.url.startsWith('/')) {
        const fullImagePath = path.join(options.publicFolder, node.url);
        const imageSize = getImageSize(fullImagePath);
        // Leave the path as-is, just append the size hash
        node.url = node.url + `#${imageSize.width}x${imageSize.height}`;
        return;
      }

      // Local images (relative paths): resolve to /mdx-images/encoded-path-filename.ext
      // Compute the absolute path to the image
      const mdxDir = path.dirname(options.mdxFilePath);
      const absImagePath = path.resolve(mdxDir, node.url);
      const imageSize = getImageSize(absImagePath);

      // Create a unique, encoded path for the image (e.g., docs-foo-bar-img-foo.png)
      // Remove the workspace root and replace path separators with dashes
      let relPath = path.relative(options.sourceFolder, absImagePath);
      relPath = relPath.replace(/[\\/]/g, '-');
      node.url = `/mdx-images/${relPath}#${imageSize.width}x${imageSize.height}`;
    });
}

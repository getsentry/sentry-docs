import path from 'path';

import getImageSize from 'image-size';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {visit} from 'unist-util-visit';

/**
 * Appends image size and content hash to the URL.
 * e.g. /img.png -> /img.png?v=abc12345#100x100
 *
 * The size is consumed by docImage.tsx and passed down to next/image.
 * The content hash (?v=xxx) busts Vercel's CDN cache when images are updated.
 */
export default function remarkImageSize(options) {
  return tree =>
    visit(tree, 'image', node => {
      // don't process external images
      if (node.url.startsWith('http') || node.url.startsWith('//')) {
        return;
      }
      const fullImagePath = path.join(
        // if the path starts with / it's a public asset, otherwise it's a relative path
        node.url.startsWith('/') ? options.publicFolder : options.sourceFolder,
        node.url
      );

      // Read file once for both size and content hash
      const imageBuffer = readFileSync(fullImagePath);
      const imageSize = getImageSize(imageBuffer);
      const contentHash = createHash('md5').update(imageBuffer).digest('hex').slice(0, 8);

      // Add content hash as query param (for CDN cache busting) and size as hash
      node.url = node.url + `?v=${contentHash}#${imageSize.width}x${imageSize.height}`;
    });
}

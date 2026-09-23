import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

import path from 'path';
import sharp from 'sharp';
import {visit} from 'unist-util-visit';

/**
 * Processes images in MDX content:
 * 1. Appends image dimensions as a URL hash (for next/image sizing)
 * 2. Appends content hash as query param (for Vercel CDN cache busting)
 *
 * e.g. /img.png -> /img.png?v=abc12345#100x100
 *
 * The size (#WxH) is consumed by docImage.tsx and passed down to next/image.
 * The content hash (?v=xxx) ensures browsers/CDN fetch fresh images when content changes.
 */
export default function remarkImageProcessing(options) {
  return async tree => {
    // sharp only exposes an async metadata API, so collect the nodes first and
    // resolve their dimensions together.
    const imageNodes = [];
    visit(tree, 'image', node => {
      // don't process external images
      if (node.url.startsWith('http') || node.url.startsWith('//')) {
        return;
      }
      imageNodes.push(node);
    });

    await Promise.all(
      imageNodes.map(async node => {
        const fullImagePath = path.join(
          // if the path starts with / it's a public asset, otherwise it's a relative path
          node.url.startsWith('/') ? options.publicFolder : options.sourceFolder,
          node.url
        );

        // Read file buffer once for both operations to avoid redundant disk I/O
        const imageBuffer = readFileSync(fullImagePath);
        const {width, height} = await sharp(imageBuffer).metadata();
        const contentHash = createHash('md5')
          .update(imageBuffer)
          .digest('hex')
          .slice(0, 8);

        // Add content hash as query param (for CDN cache busting) and size as hash
        node.url += `?v=${contentHash}#${width}x${height}`;
      })
    );
  };
}

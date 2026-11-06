import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

import path from 'path';
import sharp from 'sharp';
import {visit} from 'unist-util-visit';

const MAX_IMAGE_WIDTH = 900;

/**
 * Processes images in MDX content:
 * 1. Appends image dimensions capped at 900px wide as a URL hash (for next/image sizing)
 * 2. Appends content hash as query param (for Vercel CDN cache busting)
 *
 * e.g. /img.png -> /img.png?v=abc12345#100x100
 *
 * For relative imports, remark-image-resize copies #WxH to JSX attributes before
 * the bundler strips the hash. DocImage reads the hash for public asset URLs.
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
        let {width, height} = await sharp(imageBuffer).metadata();
        if (width > MAX_IMAGE_WIDTH) {
          // cap new height proportionally to MAX_IMAGE_WIDTH
          height = Math.max(1, Math.round((height * MAX_IMAGE_WIDTH) / width));
          width = MAX_IMAGE_WIDTH;
        }
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

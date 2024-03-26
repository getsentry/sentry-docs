import path from 'path';

import getImageSize from 'image-size';
import {visit} from 'unist-util-visit';

/**
 * appends the image size to the image url as a hash e.g. /img.png -> /img.png#100x100
 * the size is consumed by docImage.tsx and passed down to next/image
 * **this is a hack!**, there's probably a better way to set image node properties
 * but adding a hash to the url seems like a very low risk way to do it 🙈
 */
export default function remarkImageSize(options) {
  return tree =>
    visit(tree, 'image', node => {
      // don't process external images
      if (node.url.startsWith('http')) {
        return;
      }
      const fullImagePath = path.join(
        // if the path starts with / it's a public asset, otherwise it's a relative path
        node.url.startsWith('/') ? options.publicFolder : options.sourceFolder,
        node.url
      );
      const imageSize = getImageSize(fullImagePath);
      node.url = node.url + `#${imageSize.width}x${imageSize.height}`;
    });
}

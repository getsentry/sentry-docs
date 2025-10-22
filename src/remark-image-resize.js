import {visit} from 'unist-util-visit';

const SIZE_FROM_ALT_RE = /\s*=\s*(?:(\d+)\s*x\s*(\d+)|(\d+)\s*x|x\s*(\d+))\s*$/;
/**
 * remark plugin to parse width/height hints from the image ALT text.
 *
 * This plugin is intended to run AFTER `remark-mdx-images`, so it processes
 * mdxJsxTextElement nodes named `img` (i.e., <img /> in MDX).
 *
 * Supported ALT suffixes (trailing in ALT text):
 *   ![Alt text =300x200](./image.png)
 *   ![Alt text =300x](./image.png)
 *   ![Alt text =x200](./image.png)
 *
 * Behavior:
 * - Extracts the trailing "=WxH" (width-only/height-only also supported).
 * - Cleans the ALT text by removing the size suffix.
 * - Adds numeric `width`/`height` attributes to the <img> element.
 */
export default function remarkImageResize() {
  return tree =>
    visit(tree, {type: 'mdxJsxTextElement', name: 'img'}, node => {
      // Handle MDX JSX <img> produced by remark-mdx-images
      const altIndex = node.attributes.findIndex(a => a && a.name === 'alt');
      const altValue =
        altIndex !== -1 && typeof node.attributes[altIndex].value === 'string'
          ? node.attributes[altIndex].value
          : null;
      if (altValue) {
        const sizeMatch = altValue.match(SIZE_FROM_ALT_RE);
        if (sizeMatch) {
          const [, wBoth, hBoth, wOnlyWithX, hOnlyWithX] = sizeMatch;
          const wStr = wBoth || wOnlyWithX || undefined;
          const hStr = hBoth || hOnlyWithX || undefined;
          const cleanedAlt = altValue.replace(SIZE_FROM_ALT_RE, '').trim();
          // set cleaned alt
          node.attributes[altIndex] = {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: cleanedAlt,
          };

          if (wStr)
            node.attributes.push({type: 'mdxJsxAttribute', name: 'width', value: wStr});
          if (hStr)
            node.attributes.push({type: 'mdxJsxAttribute', name: 'height', value: hStr});
        }
      }
    });
}

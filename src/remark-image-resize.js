import {visit} from 'unist-util-visit';

const SIZE_FROM_ALT_RE = /\s*=\s*(?:(\d+)\s*x\s*(\d+)|(\d+)\s*x|x\s*(\d+))\s*$/;
/**
 * remark plugin to parse width/height hints from the image ALT text.
 *
 * Supported ALT suffixes (trailing in ALT text):
 *   ![Alt text =300x200](./image.png)
 *   ![Alt text =300x](./image.png)
 *   ![Alt text =x200](./image.png)
 *
 * Handles both:
 * - Regular `image` AST nodes (standard markdown images) — converts to
 *   mdxJsxTextElement with width/height attributes when size suffix is found
 * - `mdxJsxTextElement` nodes named `img` (legacy, from remark-mdx-images)
 */
export default function remarkImageResize() {
  return tree => {
    // Handle regular markdown image nodes — convert to JSX <img> with attributes
    visit(tree, 'image', (node, index, parent) => {
      if (!node.alt || !parent) {
        return;
      }
      const sizeMatch = node.alt.match(SIZE_FROM_ALT_RE);
      if (!sizeMatch) {
        return;
      }
      const [, wBoth, hBoth, wOnlyWithX, hOnlyWithX] = sizeMatch;
      const w = wBoth || wOnlyWithX || undefined;
      const h = hBoth || hOnlyWithX || undefined;
      const cleanedAlt = node.alt.replace(SIZE_FROM_ALT_RE, '').trim();

      // Convert to mdxJsxTextElement so we can set width/height attributes
      const attributes = [
        {type: 'mdxJsxAttribute', name: 'alt', value: cleanedAlt},
        {type: 'mdxJsxAttribute', name: 'src', value: node.url},
      ];
      if (node.title) {
        attributes.push({type: 'mdxJsxAttribute', name: 'title', value: node.title});
      }
      if (w) {
        attributes.push({type: 'mdxJsxAttribute', name: 'width', value: w});
      }
      if (h) {
        attributes.push({type: 'mdxJsxAttribute', name: 'height', value: h});
      }

      const jsxElement = {
        type: 'mdxJsxTextElement',
        name: 'img',
        children: [],
        attributes,
      };

      parent.children.splice(index, 1, jsxElement);
    });

    // Handle MDX JSX <img> produced by remark-mdx-images (backwards compat)
    visit(tree, {type: 'mdxJsxTextElement', name: 'img'}, node => {
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
  };
}

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
 * - Manual sizes replace inferred dimensions, including width-only/height-only sizes.
 * - Copies inferred dimensions from imports to JSX before the bundler strips URL hashes.
 */
export default function remarkImageResize() {
  return tree => {
    // remember hash dimensions for each image import
    const dimensionsByImport = new Map();
    visit(tree, 'mdxjsEsm', node => {
      for (const declaration of node.data?.estree?.body ?? []) {
        if (declaration.type !== 'ImportDeclaration') continue;
        const dimensions = declaration.source.value.match(/#(\d+)x(\d+)$/);
        if (dimensions) {
          for (const specifier of declaration.specifiers) {
            dimensionsByImport.set(
              specifier.local.name,
              // take the captured groups from the regex match (ie width and height)
              dimensions.slice(1)
            );
          }
        }
      }
    });

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
          return;
        }
      }

      // inject inferred dimensions if not already manually overridden as width and height attributes
      if (
        node.attributes.some(attribute => ['width', 'height'].includes(attribute.name))
      ) {
        return;
      }
      const src = node.attributes.find(attribute => attribute.name === 'src');
      const dimensions = dimensionsByImport.get(src?.value?.value);
      if (dimensions) {
        node.attributes.push(
          {type: 'mdxJsxAttribute', name: 'width', value: dimensions[0]},
          {type: 'mdxJsxAttribute', name: 'height', value: dimensions[1]}
        );
      }
    });
  };
}

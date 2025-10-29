import {visit} from 'unist-util-visit';

/**
 * Remark plugin to extract the first image URL from markdown content.
 * This extracts the first image found in the document to be used as the
 * Open Graph image for social sharing.
 *
 * IMPORTANT: This plugin must run BEFORE remarkMdxImages so it can capture
 * standard markdown image nodes before they are transformed to JSX.
 *
 * The extracted image URL is exported via the exportRef option and can be
 * accessed after processing to set in frontmatter or metadata.
 *
 * @param options - Plugin options
 * @param options.exportRef - Array to store the extracted first image URL
 */
export default function remarkExtractFirstImage(options: {exportRef: string[]}) {
  return (tree: any) => {
    let firstImage: string | null = null;

    // Visit standard markdown image nodes
    // This runs before remarkMdxImages transforms them to JSX
    visit(tree, 'image', (node: any) => {
      if (!firstImage && node.url) {
        firstImage = node.url;
        return false; // Stop visiting once we find the first image
      }
      return undefined;
    });

    // Export the first image URL if found
    if (firstImage) {
      options.exportRef.push(firstImage);
    }
  };
}

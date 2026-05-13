import {visit} from 'unist-util-visit';

/**
 * Rehype plugin that expands CodeTabs for markdown export.
 *
 * The remark-code-tabs plugin injects hidden <div data-code-tab-title>
 * blocks alongside the interactive <CodeTabs> component inside each
 * .code-tabs-wrapper. These hidden blocks contain the raw code for every
 * tab and are always present in the static HTML (unlike CodeTabs output,
 * which may only include the active tab due to RSC serialization).
 *
 * This plugin:
 *  1. Finds parent elements that contain [data-code-tab-title] children
 *  2. Replaces ALL children with expanded export blocks (removing the
 *     CodeTabs-rendered content to avoid duplication)
 *  3. Each export block becomes a bold heading + fenced code block.
 *     The heading format is "[Tab Title] filename" when both exist,
 *     or just the tab title / filename when only one is present
 */
export function rehypeExpandCodeTabs() {
  return tree => {
    visit(tree, 'element', node => {
      if (!node.children) {
        return;
      }

      const exportBlocks = node.children.filter(
        child => child.type === 'element' && child.properties?.dataCodeTabTitle
      );
      if (exportBlocks.length === 0) {
        return;
      }

      node.children = exportBlocks.flatMap(block => {
        const title = block.properties.dataCodeTabTitle;
        const filename = block.properties.dataCodeTabFilename;
        const label =
          filename && title ? `[${title}] ${filename}` : filename || title;

        const preElements = collectAll(block, el => el.tagName === 'pre');
        if (preElements.length === 0) {
          return [];
        }

        return [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [
              {
                type: 'element',
                tagName: 'strong',
                properties: {},
                children: [{type: 'text', value: label}],
              },
            ],
          },
          ...preElements,
        ];
      });
    });
  };
}

function collectAll(node, predicate) {
  const results = [];
  (function walk(n) {
    if (n.type === 'element' && predicate(n)) {
      results.push(n);
      return;
    }
    if (n.children) {
      for (const child of n.children) {
        walk(child);
      }
    }
  })(node);
  return results;
}

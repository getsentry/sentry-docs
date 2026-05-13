import {visit} from 'unist-util-visit';

/**
 * Rehype plugin that expands CodeTabs panels for markdown export.
 *
 * CodeTabs renders all tab panels in the DOM but hides non-active ones with
 * the `hidden` attribute. Each panel carries `data-code-tab-title` and
 * optionally `data-code-tab-filename`. This plugin:
 *  1. Removes the `hidden` attribute so rehypeRemark processes every panel
 *  2. Strips CodeBlock chrome (filename display, copy button) from the panel
 *  3. Inserts a bold heading (preferring filename, falling back to tab title)
 *     before the <pre> block so readers can tell which file the snippet
 *     belongs to
 */
export function rehypeExpandCodeTabs() {
  return tree => {
    visit(tree, 'element', node => {
      const title = node.properties?.dataCodeTabTitle;
      if (!title) {
        return;
      }
      delete node.properties.hidden;
      const filename = node.properties?.dataCodeTabFilename;
      delete node.properties.dataCodeTabTitle;
      delete node.properties.dataCodeTabFilename;

      const label = filename || title;
      const preElements = collectAll(node, el => el.tagName === 'pre');
      if (preElements.length === 0) {
        return;
      }

      const heading = {
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
      };

      node.children = [heading, ...preElements];
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

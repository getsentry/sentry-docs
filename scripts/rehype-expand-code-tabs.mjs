import {visit} from 'unist-util-visit';

/**
 * Rehype plugin that converts CodeTabs export blocks for markdown export.
 *
 * The remark-code-tabs plugin injects hidden <div data-code-tab-title>
 * blocks alongside the interactive <CodeTabs> component inside each
 * .code-tabs-wrapper. These hidden blocks contain the raw code for every
 * tab and are always present in the static HTML (unlike CodeTabs output,
 * which may only include the active tab due to RSC serialization).
 *
 * Behavior depends on whether the wrapper has data-code-tab-md-expand-tabs
 * (set via {mdExpandTabs} in any code fence of the group):
 *
 *  - With flag: all tabs are expanded with "[Title] filename" headings.
 *  - Without flag (default): only the first tab is kept, plus a note
 *    listing the other available tab titles.
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

      const expandAll = node.properties?.dataCodeTabMdExpandTabs != null;

      if (expandAll) {
        node.children = expandAllTabs(exportBlocks);
      } else {
        node.children = collapseToFirstTab(exportBlocks);
      }
    });
  };
}

function expandAllTabs(exportBlocks) {
  return exportBlocks.flatMap(block => {
    const title = block.properties.dataCodeTabTitle;
    const filename = block.properties.dataCodeTabFilename;
    const label = filename && title ? `[${title}] ${filename}` : filename || title;

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
}

function collapseToFirstTab(exportBlocks) {
  const first = exportBlocks[0];
  const preElements = collectAll(first, el => el.tagName === 'pre');
  if (preElements.length === 0) {
    return [];
  }

  const result = [...preElements];

  const otherTitles = exportBlocks
    .slice(1)
    .map(block => block.properties.dataCodeTabTitle)
    .filter(Boolean);

  if (otherTitles.length > 0) {
    result.push({
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'em',
          properties: {},
          children: [
            {
              type: 'text',
              value: `Other available variations of the above snippet: ${otherTitles.join(', ')}`,
            },
          ],
        },
      ],
    });
  }

  return result;
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

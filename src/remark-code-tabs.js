import { visit } from 'unist-util-visit';

function getFullMeta(node) {
  if (node.lang && node.meta) {
    return node.lang + node.meta;
  }
  return node.lang || node.meta;
}

function getFilename(node) {
  const meta = getFullMeta(node);
  const match = (meta || '').match(/\{filename:\s*([^}]+)\}/);
  return (match && match[1]) || '';
}

function getTabTitle(node) {
  const meta = getFullMeta(node);
  const match = (meta || '').match(/\{tabTitle:\s*([^}]+)\}/);
  return (match && match[1]) || '';
}

// TODO(dcramer): this should only operate on MDX
export default function remarkCodeTabs() {
  return (markdownAST) => {
    let lastParent = null;
    let pendingCode = [];
    let toRemove = [];

    function flushPendingCode() {
      if (pendingCode.length === 0) {
        return;
      }

      const rootNode = pendingCode[0][0];
      const children = pendingCode.reduce(
        (arr, [node]) =>
          arr.concat([
            {
              type: 'mdxJsxFlowElement',
              name: 'CodeBlock',
              attributes: [
                {type: 'mdxJsxAttribute', name: 'language', value: `${node.lang || ''}`},
                {type: 'mdxJsxAttribute', name: 'title', value: getTabTitle(node)},
              ],
              children: [Object.assign({}, node)],
            },
          ]),
        []
      );

      rootNode.type = 'element';
      rootNode.data = {
        hName: 'div',
        hProperties: {
          className: 'code-tabs-wrapper',
        },
      };
      rootNode.children = [
        {
          type: 'mdxJsxFlowElement',
          name: 'CodeTabs',
          children: children,
        },
      ];

      toRemove = toRemove.concat(pendingCode.splice(1));
    }

    visit(
      markdownAST,
      () => true,
      (node, _index, parent) => {
        if (node.type !== 'code' || parent !== lastParent) {
          flushPendingCode();
          pendingCode = [];
          lastParent = parent;
        }
        if (node.type === 'code') {
          pendingCode.push([node, parent]);
        }
      }
    );

    flushPendingCode();

    toRemove.forEach(([node, parent]) => {
      parent.children = parent.children.filter(n => n !== node);
    });

    return markdownAST;
  }
};

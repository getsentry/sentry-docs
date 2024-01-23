import {visit} from 'unist-util-visit';

function getFullMeta(node) {
  if (node.lang && node.meta) {
    return node.lang + node.meta;
  }
  return node.lang || node.meta;
}

function fixLanguage(node) {
  // Title can be something like this without spaces, let's fix it to have proper lang
  // ```javascript{tabTitle: Angular 12+}{filename: main.ts}
  // match everytung between ``` and {
  const match = node.lang.match(/([^{]+)\{/);
  // if we match a broken lang with no spacing, we fix it and also put the remainder in front of meta
  if (match && match[1]) {
    node.meta = `${node.lang.replace(match[1], '')}${node.meta}`;
    node.lang = (match && match[1]) || node.lang;
  }
  return `${node.lang || ''}`;
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
  return markdownAST => {
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
                {
                  type: 'mdxJsxAttribute',
                  name: 'language',
                  value: fixLanguage(node),
                },
                {type: 'mdxJsxAttribute', name: 'title', value: getTabTitle(node)},
                {type: 'mdxJsxAttribute', name: 'filename', value: getFilename(node)},
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
          children,
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
          if (node.lang === null) {
            node.lang = 'bash'; // bash is the default
          }
          pendingCode.push([node, parent]);
        }
      }
    );

    flushPendingCode();

    toRemove.forEach(([node, parent]) => {
      parent.children = parent.children.filter(n => n !== node);
    });

    return markdownAST;
  };
}

/**
 * A remark plugin to handle definition lists
 * adapted from https://github.com/Symbitic/remark-plugins/blob/master/packages/remark-deflist/src/index.ts
 *
 * Not a perfect implementation is esbuild chokes on html/jsx syntax within definition lists
 * It works as long as the definition contains plain markdown syntax
 *
 * line breaks are transformed to <br /> elements on purpose as a workaround
 */

/**
 * Detect metadata and add it to the `data` field of a VFile.
 */
import type {Parent} from 'mdast';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {toMarkdown} from 'mdast-util-to-markdown';
import {toString} from 'mdast-util-to-string';
import type {Transformer} from 'unified';
import type {Node} from 'unist';
import {visit} from 'unist-util-visit';

// Test if deflist is contained in a single paragraph.
const isSingleDeflist = (node: Node) =>
  /^[^:].+\n:\s/.test(toString(node)) && node.type === 'paragraph';

// Test if deflist is split between two paragraphs.
const isSplitDeflist = (node: Node, i: number, parent: Parent) =>
  i > 0 &&
  /^:\s/.test(toString(node)) &&
  !/^:\s/.test(toString(parent.children[i - 1])) &&
  node.type === 'paragraph' &&
  parent.children[i - 1].type === 'paragraph';

const isdeflist = (node: Node, i: number, parent: Parent) =>
  isSingleDeflist(node) || isSplitDeflist(node, i, parent);

export default function deflist(): Transformer {
  return tree => {
    visit(tree, 'paragraph', (node: Node, i, parent: Parent) => {
      const isdef = isdeflist(node, i!, parent);
      if (!isdef) {
        return;
      }
      let dd;
      let dt;
      let count = 0;
      let start: number = 0;

      if (isSingleDeflist(node)) {
        const [title, ...children] = toMarkdown(node as any).split(/\n:\s+/);

        const childs = fromMarkdown(title).children as Parent[];

        dt = childs.flatMap(n => n.children);
        dd = children
          .map(str => fromMarkdown(str) as Parent)
          .flatMap(n => n.children)
          .map((n: any) => ({
            type: 'descriptiondetails',
            data: {
              hName: 'dd',
            },
            children: n.children,
          }));
        start = i as number;
        count = 1;
      } else {
        const childs = parent!.children[i! - 1] as Parent;
        dt = childs.children;
        dd = toMarkdown(node as any)
          .replace(/^:\s+/, '')
          .split(/\n:\s+/)
          .map(str => fromMarkdown(str) as Parent)
          .flatMap(({children}) => children)
          .map(({children}: any) => ({
            type: 'descriptiondetails',
            data: {
              hName: 'dd',
            },
            children,
          }));
        start = i! - 1;
        count = 2;
      }

      const child = {
        type: 'descriptionlist',
        data: {
          hName: 'dl',
        },
        children: [
          {
            type: 'descriptionterm',
            data: {
              hName: 'dt',
            },
            children: dt,
          },
          ...dd.map(el => replaceNewlinesWithBr(el)),
        ],
      };

      // @ts-ignore
      parent!.children.splice(start, count, child);
    });

    visit(tree, ['descriptionlist'], (node, i, parent: Parent) => {
      const start = i;
      let count = 1;
      let children = (node as Parent).children;

      for (let j = i! + 1; j < parent!.children.length; j++) {
        const next = parent!.children[j] as Parent;
        if (next.type === 'descriptionlist') {
          count++;
          children = children.concat(next.children);
        } else {
          break;
        }
      }

      if (count === 1) {
        return;
      }

      (node as Parent).children = children;

      // @ts-ignore
      parent!.children.splice(start!, count, node);
    });
  };
}

function replaceNewlinesWithBr(node: Node) {
  // If the current node is a text node
  // @ts-ignore
  if (node.type === 'text' && node.value.includes('\n')) {
    // @ts-ignore
    const textParts: string[] = node.value.split('\n'); // Split the text by newline

    // Create a new array of children, with each part of the text and <br/> nodes in between
    const newChildren = [];
    textParts.forEach((part, index) => {
      if (part) {
        // @ts-ignore
        newChildren.push({type: 'text', value: part});
      }
      if (index < textParts.length - 1) {
        // @ts-ignore
        newChildren.push({type: 'element', tagName: 'br', children: []});
      }
    });

    // Replace the text node with these children
    return newChildren;
  }

  // If the node has children, recursively process them
  // @ts-ignore
  if (node.children && Array.isArray(node.children)) {
    // @ts-ignore
    node.children = node.children.flatMap(child => replaceNewlinesWithBr(child));
  }

  // Return the processed node
  return node;
}

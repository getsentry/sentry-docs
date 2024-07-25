import type {Root} from 'mdast';
import type {Plugin} from 'unified';
import type {Node} from 'unist';
import {visit} from 'unist-util-visit';

const affectedComponents = ['PlatformIdentifier'];

const remarkComponentSpacing: Plugin<void[], Root> = function () {
  return (tree, _file) => {
    let componentNode: Node | undefined = undefined;
    let componentNodeParent: Node | undefined = undefined;
    return visit(tree, (node, _, parent) => {
      if (componentNode) {
        if (parent === componentNodeParent) {
          // If the component is followed by text starting with a space, turn it
          // into a no-break space character (unicode 00A0). Otherwise MDX
          // removes the space, leading to smushed text.
          if (node.type === 'text' && node.value && node.value[0] === ' ') {
            node.value = `\u00A0${node.value.substring(1)}`;
          }
        }
        componentNode = componentNodeParent = undefined;
      } else if (
        // @ts-expect-error TODO(lforst): leftover from migration
        node.type === 'mdxJsxTextElement' &&
        // @ts-expect-error TODO(lforst): leftover from migration
        affectedComponents.includes(node.name ?? '')
      ) {
        componentNode = node;
        // @ts-ignore TODO(lforst): leftover from migration
        componentNodeParent = parent;
      }
    });
  };
};

export default remarkComponentSpacing;

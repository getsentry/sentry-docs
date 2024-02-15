import {visit} from 'unist-util-visit';

const affectedComponents = ['PlatformIdentifier'];

export default function remarkComponentSpacing() {
  return (tree, _file) => {
    let componentNode = undefined;
    let componentNodeParent = undefined;
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
        node.type === 'mdxJsxTextElement' &&
        affectedComponents.includes(node.name)
      ) {
        componentNode = node;
        componentNodeParent = parent;
      }
    });
  };
}

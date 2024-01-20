import {load} from 'js-yaml';
import {visit} from 'unist-util-visit';

export default function extractFrontmatter() {
  return (tree, file) => {
    visit(tree, 'yaml', (node, index, parent) => {
      file.data.frontmatter = load(node.value);
    });
  };
}

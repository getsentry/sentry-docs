import {load} from 'js-yaml';
import {visit} from 'unist-util-visit';

export default function extractFrontmatter() {
  return (tree, file) => {
    visit(tree, 'yaml', node => {
      file.data.frontmatter = load(node.value);
    });
  };
}

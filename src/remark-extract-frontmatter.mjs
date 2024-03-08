import {load} from 'js-yaml';
import {visit} from 'unist-util-visit';

export function remarkExtractFrontmatter() {
  return (tree, file) => {
    visit(tree, 'yaml', node => {
      file.data.frontmatter = load(node.value);
    });
  };
}

import {load} from 'js-yaml';
import type {Root} from 'mdast';
import type {Plugin} from 'unified';
import {visit} from 'unist-util-visit';

const extractFrontmatter: Plugin<void[], Root> = function () {
  return (tree, file) => {
    visit(tree, 'yaml', node => {
      file.data.frontmatter = load(node.value);
    });
  };
};
export default extractFrontmatter;

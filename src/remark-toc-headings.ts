import {slug} from 'github-slugger';
import type {Root} from 'mdast';
import {toString} from 'mdast-util-to-string';
import type {Plugin} from 'unified';
import {visit} from 'unist-util-visit';

export type TocNode = {
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  url: string;
  value: string;
};
type Options = {exportRef: TocNode[]};

const remarkTocHeadings: Plugin<[options: Options], Root> = function (options) {
  return tree =>
    visit(tree, 'heading', node => {
      const textContent = toString(node);
      options.exportRef.push({
        value: textContent,
        url: '#' + slug(textContent),
        depth: node.depth,
      });
    });
};

export default remarkTocHeadings;

const Remark = require('remark');
const remarkMdx = require('remark-mdx');

const plugin = require('../');

const remark = new Remark()
  .data('settings', {
    commonmark: true,
    footnotes: true,
    pedantic: true,
  })
  .use(remarkMdx);

describe('gatsby-plugin-include', () => {
  it('resolves one import', () => {
    const markdownAST = remark.parse(`
import "./foo.mdx";
`);
    const transformed = plugin({markdownAST}, {});
    expect(transformed).toMatchSnapshot();
  });

  it('resolves two imports', () => {
    const markdownAST = remark.parse(`
import "./foo.mdx";

import "./bar.mdx";
`);
    const transformed = plugin({markdownAST}, {});
    expect(transformed).toMatchSnapshot();
  });
});

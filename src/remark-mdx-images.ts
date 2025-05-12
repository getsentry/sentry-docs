import {type ImportDeclaration} from 'estree';
import {type Root} from 'mdast';
import {type MdxJsxTextElement} from 'mdast-util-mdx';
import {type Plugin} from 'unified';
import {visit} from 'unist-util-visit';

export interface RemarkMdxImagesOptions {
  /**
   * By default imports are resolved relative to the markdown file. This matches default markdown
   * behaviour. If this is set to false, this behaviour is removed and URLs are no longer processed.
   * This allows to import images from `node_modules`. If this is disabled, local images can still
   * be imported by prepending the path with `./`.
   *
   * @default true
   */
  resolve?: boolean;
}

const urlPattern = /^(https?:)?\//;
const relativePathPattern = /\.\.?\//;

/**
 * A Remark plugin for converting Markdown images to MDX images using imports for the image source.
 */
const remarkMdxImages: Plugin<[RemarkMdxImagesOptions?], Root> =
  ({resolve = true} = {}) =>
  ast => {
    const imports: ImportDeclaration[] = [];
    const imported = new Map<string, string>();

    visit(ast, 'image', (node, index, parent) => {
      let {alt = null, title, url} = node;
      url = decodeURIComponent(url);
      if (urlPattern.test(url)) {
        return;
      }
      if (!relativePathPattern.test(url) && resolve) {
        url = `./${url}`;
      }

      let name = imported.get(url);
      console.log('✅✅ url', url);
      if (!name) {
        name = `__${imported.size}_${url.replaceAll(/\W/g, '_')}__`;
        console.log('✅ new name', name);

        imports.push({
          type: 'ImportDeclaration',
          source: {type: 'Literal', value: url},
          specifiers: [
            {
              type: 'ImportDefaultSpecifier',
              local: {type: 'Identifier', name},
            },
          ],
        });
        imported.set(url, name);
      }

      const textElement: MdxJsxTextElement = {
        type: 'mdxJsxTextElement',
        name: 'img',
        children: [],
        attributes: [
          {type: 'mdxJsxAttribute', name: 'alt', value: alt},
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: name,
              data: {
                estree: {
                  type: 'Program',
                  sourceType: 'module',
                  comments: [],
                  body: [
                    {type: 'ExpressionStatement', expression: {type: 'Identifier', name}},
                  ],
                },
              },
            },
          },
        ],
      };
      if (title) {
        textElement.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'title',
          value: title,
        });
      }
      parent!.children.splice(index!, 1, textElement);
    });

    if (imports.length) {
      ast.children.unshift({
        type: 'mdxjsEsm',
        value: '',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: imports,
          },
        },
      });
      ast.children.splice(1, 1)
      console.log(ast)
    }
  };

export default remarkMdxImages;

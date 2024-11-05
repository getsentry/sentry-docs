import Link from 'next/link';

import {nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {sortPages} from 'sentry-docs/utils';

type Props = {
  nextPages: boolean;
  /**
   * A list of pages to exclude from the grid.
   * Specify the file name of the page, for example, "index" for "index.mdx"
   */
  exclude?: string[];
  header?: string;
};

export function PageGrid({header, exclude}: Props) {
  const {rootNode, path} = serverContext();

  const parentNode = nodeForPath(rootNode, path);
  if (!parentNode) {
    return null;
  }

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {sortPages(
          parentNode.children.filter(
            c =>
              !c.frontmatter.sidebar_hidden &&
              c.frontmatter.title &&
              !exclude?.includes(c.slug)
          ),
          // a hacky adapter to reuse the same sidebar sorter
          node => ({...node, context: node.frontmatter})
        ).map(n => (
          <li key={n.path} style={{marginBottom: '1rem'}}>
            <h4 style={{marginBottom: '0px'}}>
              <Link href={'/' + n.path}>{n.frontmatter.title}</Link>
            </h4>
            {n.frontmatter.description && <p>{n.frontmatter.description}</p>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

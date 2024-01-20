import Link from 'next/link';

import {nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

type Props = {
  nextPages: boolean;
  /**
   * A list of pages to exclude from the grid.
   * Specify the file name of the page, for example, "index" for "index.mdx"
   */
  exclude?: string[];
  header?: string;
};

export function PageGrid({nextPages = false, header, exclude}: Props) {
  const {rootNode, path} = serverContext();
  if (!rootNode) {
    return null;
  }

  const parentNode = nodeForPath(rootNode, path);
  if (!parentNode) {
    return null;
  }

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {parentNode.children.map(n => (
          <li key={n.path} style={{marginBottom: '1rem'}}>
            <h4 style={{marginBottom: 0}}>
              <Link href={'/' + n.path}>{n.frontmatter.title}</Link>
            </h4>
            {n.frontmatter.description ?? <p>{n.frontmatter.description}</p>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

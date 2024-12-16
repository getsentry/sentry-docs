import path from 'path';

import Link from 'next/link';

import {DocNode, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {isNotNil, sortPages} from 'sentry-docs/utils';

type Props = {
  exclude?: string[];
  header?: string;
};

export function PageGrid({header, exclude}: Props) {
  const {rootNode, path: nodePath} = serverContext();

  const parentNode = nodeForPath(rootNode, nodePath);
  if (!parentNode || parentNode.children.length === 0) {
    return null;
  }

  const children: DocNode[] = parentNode.frontmatter.next_steps?.length
    ? (parentNode.frontmatter.next_steps
        .map(p => nodeForPath(rootNode, path.join(parentNode.path, p)))
        .filter(isNotNil) ?? [])
    : parentNode.children;

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {sortPages(
          children.filter(
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

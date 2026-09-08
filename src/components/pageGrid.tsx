import Link from 'next/link';
import path from 'path';
import {DocNode, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {isNotNil, sortPages} from 'sentry-docs/utils';
import {isVersioned} from 'sentry-docs/versioning';

type Props = {
  /** Root-relative pages to include alongside the current page's children. */
  additionalPages?: string[];
  exclude?: string[];
  header?: string;
};

export function PageGrid({additionalPages = [], header, exclude}: Props) {
  const {rootNode, path: nodePath} = serverContext();

  const parentNode = nodeForPath(rootNode, nodePath);
  if (!parentNode) {
    return null;
  }

  const childPages: DocNode[] = parentNode.frontmatter.next_steps?.length
    ? (parentNode.frontmatter.next_steps
        .map(p => nodeForPath(rootNode, path.join(parentNode.path, p)))
        .filter(isNotNil) ?? [])
    : parentNode.children;
  const additionalPageNodes = additionalPages
    .map(pagePath => nodeForPath(rootNode, pagePath.split('/').filter(Boolean)))
    .filter(isNotNil);
  const children = [
    ...new Map(
      [...childPages, ...additionalPageNodes].map(child => [child.path, child])
    ).values(),
  ];

  if (children.length === 0) {
    return null;
  }

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {sortPages(
          children.filter(
            c =>
              !c.frontmatter.sidebar_hidden &&
              c.frontmatter.title &&
              !exclude?.includes(c.slug) &&
              !isVersioned(c.slug)
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

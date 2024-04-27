import path from 'path';

import Link from 'next/link';

import {DocNode, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {isTruthy} from 'sentry-docs/utils';

type Props = {
  header?: string;
};

export function PageGrid({header}: Props) {
  const {rootNode, path: nodePath} = serverContext();
  if (!rootNode) {
    return null;
  }

  const parentNode = nodeForPath(rootNode, nodePath);
  if (!parentNode || parentNode.children.length === 0) {
    return null;
  }

  const children: DocNode[] = parentNode.frontmatter.next_steps?.length
    ? parentNode.frontmatter.next_steps
        .map(p => nodeForPath(rootNode, path.join(parentNode.path, p)))
        .filter(isTruthy) ?? []
    : parentNode.children;

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {children
          /* NOTE: temp fix while we figure out the reason why some nodes have empty front matter */
          .filter(c => c.frontmatter.title)
          .map(n => (
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

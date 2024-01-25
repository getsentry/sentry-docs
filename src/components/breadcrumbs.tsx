import type {Route} from 'next';

import {DocNode, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {SmartLink} from './smartLink';

export function Breadcrumbs() {
  const {rootNode, path} = serverContext();
  if (!rootNode) {
    return null;
  }

  const pageNode = nodeForPath(rootNode, path);
  const nodes: DocNode<string>[] = [];
  for (let node: DocNode<string> | undefined = pageNode; node; node = node.parent) {
    if (node && !node.missing) {
      nodes.unshift(node);
    }
  }

  return (
    <ul className="breadcrumb" style={{margin: 0}}>
      {nodes.map(n => {
        const to: Route = n.path === '/' ? n.path : `/${n.path}/`;
        return (
          <li className="breadcrumb-item" key={n.path}>
            <SmartLink to={to}>{n.frontmatter.title}</SmartLink>
          </li>
        );
      })}
    </ul>
  );
}

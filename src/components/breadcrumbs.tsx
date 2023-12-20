import React from 'react';
import { DocNode, nodeForPath } from 'sentry-docs/docTree';
import { serverContext } from 'sentry-docs/serverContext';
import {SmartLink} from './smartLink';

export function Breadcrumbs() {
  const { rootNode, path } = serverContext();
  if (!rootNode) {
    return null;
  }
  
  const pageNode = nodeForPath(rootNode, path);
  const nodes: DocNode[] = [];
  for (let node: DocNode | undefined = pageNode; node; node = node.parent) {
    if (node) {
      nodes.unshift(node);
    }
  }

  return (
    <ul className="breadcrumb" style={{margin: 0}}>
      {nodes.map(n => {
        return (
          <li className="breadcrumb-item" key={n.path}>
            <SmartLink to={"/" + n.path}>{n.frontmatter.title}</SmartLink>
          </li>
        );
      })}
    </ul>
  );
}

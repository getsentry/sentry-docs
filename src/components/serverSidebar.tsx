import {Fragment} from 'react';

import {DocNode, getGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformGuide} from 'sentry-docs/types';

import {ApiSidebar} from './apiSidebar';
import {Node as PlatformSidebarNode, PlatformSidebar} from './platformSidebar';
import {ProductSidebar} from './productSidebar';
import {Sidebar, SidebarNode} from './sidebar';

export function ServerSidebar() {
  const {path, rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  let node = rootNode;
  if (path.indexOf('contributing') === 0) {
    const maybeNode = nodeForPath(rootNode, 'contributing');
    if (maybeNode) {
      node = maybeNode;
    } else {
      return null;
    }
  } else if (path.indexOf('product') === 0 || path.indexOf('platform-redirect') === 0) {
    return <ProductSidebar rootNode={rootNode} />;
  } else if (path.indexOf('cli') === 0) {
    return <ProductSidebar rootNode={rootNode} />;
  } else if (path.indexOf('concepts') === 0) {
    return <ProductSidebar rootNode={rootNode} />;
  } else if (path.indexOf('account') === 0) {
    return <ProductSidebar rootNode={rootNode} />;
  } else if (path.indexOf('api') === 0) {
    if (!rootNode) {
      return <ApiSidebar />;
    }
    return (
      <Fragment>
        <ApiSidebar />
        <hr />
        <ProductSidebar rootNode={rootNode} />
      </Fragment>
    );
  } else if (path.indexOf('platforms') === 0) {
    if (path.length === 1) {
      return <ProductSidebar rootNode={rootNode} />;
    }

    const name = path[1];
    const platformNode = nodeForPath(rootNode, ['platforms', name]);
    if (!platformNode) {
      return null;
    }

    const platform = getPlatform(rootNode, name);
    let guide: PlatformGuide | undefined;
    if (path.length >= 4 && path[2] === 'guides') {
      guide = getGuide(rootNode, name, path[3]);
    }

    const docNodeToPlatformSidebarNode = (n: DocNode) => {
      if (n.frontmatter.draft) {
        return undefined;
      }
      return {
        context: {
          platform: {
            name,
          },
          title: n.frontmatter.title,
          sidebar_order: n.frontmatter.sidebar_order,
          sidebar_title: n.frontmatter.sidebar_title,
        },
        path: '/' + n.path + '/',
      };
    };

    const nodes: PlatformSidebarNode[] = getNavNodes(
      [platformNode],
      docNodeToPlatformSidebarNode
    );

    return (
      <Fragment>
        <PlatformSidebar
          platform={{
            name,
            title: platform?.title || '',
          }}
          guide={
            guide && {
              name: guide.name,
              title: guide.title || '',
            }
          }
          nodes={nodes}
        />
        <hr />
        <ProductSidebar rootNode={rootNode} />
      </Fragment>
    );
  }

  // Must not send full DocNodes to a client component, or the entire doc tree
  // will be serialized.
  const nodeToSidebarNode = (n: DocNode): SidebarNode => {
    return {
      path: n.path,
      frontmatter: n.frontmatter,
      children: n.children.map(nodeToSidebarNode),
    };
  };
  return <Sidebar node={nodeToSidebarNode(node)} path={path} />;
}

export function getNavNodes<NavNode>(
  docNodes: DocNode[],
  docNodeToNavNode: (doc: DocNode) => NavNode | undefined,
  nodes: NavNode[] = []
) {
  docNodes.forEach(n => {
    const navNode = docNodeToNavNode(n);
    if (!navNode) {
      return;
    }
    nodes.push(navNode);
    getNavNodes(n.children, docNodeToNavNode, nodes);
  });
  return nodes;
}

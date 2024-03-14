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

    const nodes: PlatformSidebarNode[] = [
      {
        context: {
          platform: {
            name,
          },
          title: platformNode.frontmatter.title,
          sidebar_order: platformNode.frontmatter.sidebar_order,
          sidebar_title: platformNode.frontmatter.sidebar_title,
        },
        path: '/' + platformNode.path + '/',
      },
    ];
    // eslint-disable-next-line no-inner-declarations
    function addChildren(docNodes: DocNode[]) {
      docNodes.forEach(n => {
        if (n.frontmatter.draft) {
          return;
        }
        nodes.push({
          context: {
            platform: {
              name,
            },
            title: n.frontmatter.title,
            sidebar_order: n.frontmatter.sidebar_order,
            sidebar_title: n.frontmatter.sidebar_title,
          },
          path: '/' + n.path + '/',
        });
        addChildren(n.children);
      });
    }
    addChildren(platformNode.children);

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
          data={{
            allSitePage: {
              nodes,
            },
          }}
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
      frontmatter: n.frontmatter as {[key: string]: any},
      children: n.children.map(nodeToSidebarNode),
    };
  };
  return <Sidebar node={nodeToSidebarNode(node)} path={path} />;
}

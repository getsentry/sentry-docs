import {DocNode, getGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformGuide} from 'sentry-docs/types';

import {ApiSidebar} from './apiSidebar';
import {Node as PlatformSidebarNode, PlatformSidebar} from './platformSidebar';
import {NavNode, ProductSidebar} from './productSidebar';
import {Sidebar, SidebarNode} from './sidebar';

export function productSidebar(rootNode: DocNode) {
  const productNode = nodeForPath(rootNode, 'product');
  if (!productNode) {
    return null;
  }
  const nodes: NavNode[] = [
    {
      context: {
        draft: productNode.frontmatter.draft,
        title: productNode.frontmatter.title,
        sidebar_order: productNode.frontmatter.sidebar_order,
        sidebar_title: productNode.frontmatter.sidebar_title,
      },
      path: '/' + productNode.path + '/',
    },
  ];
  function addChildren(docNodes: DocNode[]) {
    docNodes.forEach(n => {
      nodes.push({
        context: {
          draft: n.frontmatter.draft,
          title: n.frontmatter.title,
          sidebar_order: n.frontmatter.sidebar_order,
          sidebar_title: n.frontmatter.sidebar_title,
        },
        path: '/' + n.path + '/',
      });
      addChildren(n.children);
    });
  }
  addChildren(productNode.children);
  const data = {
    allSitePage: {
      nodes,
    },
  };
  return <ProductSidebar data={data} />;
}

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
    return productSidebar(rootNode);
  } else if (path.indexOf('api') === 0) {
    return <ApiSidebar />;
  } else if (path.indexOf('platforms') === 0) {
    if (path.length === 1) {
      return productSidebar(rootNode);
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

import {serverContext} from 'sentry-docs/serverContext';
import {Sidebar, SidebarNode} from './sidebar';
import {DocNode, getGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';
import {NavNode, ProductSidebar} from './productSidebar';
import {PlatformSidebar, Node as PlatformSidebarNode} from './platformSidebar';
import {PlatformGuide} from 'sentry-docs/types';

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
  } else if (path.indexOf('product') === 0) {
    return productSidebar(rootNode);
  } else if (path.indexOf('platforms') === 0) {
    if (path.length === 1) {
      return productSidebar(rootNode);
    }

    const name = path[1];
    const node = nodeForPath(rootNode, ['platforms', name]);
    if (!node) {
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
          title: node.frontmatter.title,
          sidebar_order: node.frontmatter.sidebar_order,
          sidebar_title: node.frontmatter.sidebar_title,
        },
        path: '/' + node.path + '/',
      },
    ];
    function addChildren(docNodes: DocNode[]) {
      docNodes.forEach(n => {
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
    addChildren(node.children);

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
  const nodeToSidebarNode = (node: DocNode): SidebarNode => {
    return {
      path: node.path,
      frontmatter: node.frontmatter as {[key: string]: any},
      children: node.children.map(nodeToSidebarNode),
    };
  };
  return <Sidebar node={nodeToSidebarNode(node)} path={path} />;
}

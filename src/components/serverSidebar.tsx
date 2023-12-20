import { serverContext } from "sentry-docs/serverContext";
import { Sidebar } from "./sidebar";
import { DocNode, getPlatform, nodeForPath } from "sentry-docs/docTree";
import { PlatformSidebar, Node as SidebarNode } from "./platformSidebar";

export function ServerSidebar() {
  const { path, rootNode } = serverContext();
  if (!rootNode) {
    return null;
  }
  
  let node = rootNode;
  if (path.indexOf('contributing') === 0) {
    const maybeNode = nodeForPath(rootNode, 'contributing');
    if (maybeNode) {
      node = maybeNode
    } else {
      return null;
    }
  } else if (path.indexOf('platforms') === 0) {
    if (path.length === 1) {
      const maybeNode = nodeForPath(rootNode, 'products');
      if (maybeNode) {
        node = maybeNode;
      } else {
        return null;
      }
    } else {
      const name = path[1];
      const node = nodeForPath(rootNode, ['platforms', name]);
      if (!node) {
        return null;
      }

      const platform = getPlatform(rootNode, name);
      const nodes: SidebarNode[] = [{
        context: {
          platform: {
            name
          },
          title: node.frontmatter.title,
          sidebar_order: node.frontmatter.sidebar_order,
          sidebar_title: node.frontmatter.sidebar_title
        },
        path: '/' + node.path + '/'
      }];
      function addChildren(docNodes: DocNode[]) {
        docNodes.forEach(n => {
          nodes.push({
            context: {
              platform: {
                name
              },
              title: n.frontmatter.title,
              sidebar_order: n.frontmatter.sidebar_order,
              sidebar_title: n.frontmatter.sidebar_title
            },
            path: '/' + n.path + '/'
          });
          addChildren(n.children);
        })
      }
      addChildren(node.children);
      
    //   type Node = {
    //     context: {
    //       platform: {
    //         name: string;
    //       };
    //       title: string;
    //       sidebar_order?: number;
    //       sidebar_title?: string;
    //     };
    //     path: string;
    //   };
      return (
        <PlatformSidebar
          platform={{
            name,
            title: platform?.title || '',
          }}
          data={{
            allSitePage: {
              nodes
            }
          }}
        />
      );
    //   const maybeNode = nodeForPath(rootNode, `platforms/${platform}`);
    //   if (maybeNode) {
    //     node = maybeNode;
    //   } else {
    //     return null;
    //   }
    }
  }
  
  return <Sidebar node={node} path={path} />;
}

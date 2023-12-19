import { serverContext } from "sentry-docs/serverContext";
import { Sidebar } from "./sidebar";
import { nodeForPath } from "sentry-docs/docTree";

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
  }
  
  return <Sidebar node={node} path={path} />;
}

import { DocNode, nodeForPath } from "sentry-docs/docTree";
import { PlatformGridClient } from "./platformGridClient";
import { serverContext } from "sentry-docs/serverContext";

export function PlatformGrid({ noGuides = false }) {
  const { path, rootNode } = serverContext();
  if (!rootNode) {
    return null;
  }
  
  const platformsNode = nodeForPath(rootNode, 'platforms');
  if (!platformsNode) {
    return null;
  }

  return <PlatformGridClient noGuides={noGuides} platformNodes={platformsNode.children} />;
}

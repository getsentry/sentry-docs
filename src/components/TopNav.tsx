import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';

import TopNavClient from './TopNavClient';

export default async function TopNav() {
  const rootNode = await getDocsRootNode();
  const platforms = extractPlatforms(rootNode);
  return <TopNavClient platforms={platforms} />;
}

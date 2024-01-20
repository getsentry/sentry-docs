import {extractPlatforms} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformGridClient} from './platformGridClient';

export function PlatformGrid({noGuides = false}) {
  const {rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  const platforms = extractPlatforms(rootNode);
  return <PlatformGridClient noGuides={noGuides} platforms={platforms} />;
}

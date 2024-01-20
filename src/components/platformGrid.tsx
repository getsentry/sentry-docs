import {extractPlatforms} from 'sentry-docs/docTree';
import {PlatformGridClient} from './platformGridClient';
import {serverContext} from 'sentry-docs/serverContext';

export function PlatformGrid({noGuides = false}) {
  const {rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  const platforms = extractPlatforms(rootNode);
  return <PlatformGridClient noGuides={noGuides} platforms={platforms} />;
}

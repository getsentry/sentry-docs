import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {AgentSetupCallout} from './agentSetupCallout';

type Props = {
  /** Absolute URL, site-relative path, or path relative to the selected platform. */
  guideUrl: string;
  /** Migration instructions to follow after reading the guide. */
  prompt: string;
  description?: string;
};

export function AgentMigrationCallout({
  guideUrl,
  prompt,
  description = 'Copy this prompt into your AI agent to migrate your Sentry SDK.',
}: Props) {
  const {rootNode, path} = serverContext();
  const platform = getCurrentPlatformOrGuide(rootNode, path);
  const resolvedGuideUrl = new URL(
    guideUrl,
    `https://docs.sentry.io${platform?.url ?? '/'}`
  ).href;

  return (
    <AgentSetupCallout
      instructions={{
        title: 'Agent-Assisted Migration',
        prompt: `Use curl to download and read ${resolvedGuideUrl} before making changes. ${prompt}`,
        description,
      }}
    />
  );
}

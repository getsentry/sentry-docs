import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {AgentSetupCallout} from './agentSetupCallout';

export function AgentMigrationCallout() {
  const {rootNode, path} = serverContext();
  const platform = getCurrentPlatformOrGuide(rootNode, path);
  const platformUrl = platform?.url ?? '/platforms/javascript/';
  const guideUrl = `https://docs.sentry.io${platformUrl}migration/v10-to-v11.md`;

  return (
    <AgentSetupCallout
      instructions={{
        title: 'Agent-Assisted Migration',
        prompt: `Upgrade this project from Sentry JavaScript SDK v10 to v11. Use curl to download and read ${guideUrl} before making changes. Inspect the project's Sentry packages, configuration, runtime, and framework versions, then apply every migration step that applies. Preserve the intended data collection behavior when migrating sendDefaultPii to dataCollection. Use the project's package manager to update dependencies and its existing checks to verify the migration. Summarize the changes and any remaining manual steps.`,
        description: 'Copy this prompt into your AI agent to migrate to v11.',
      }}
    />
  );
}

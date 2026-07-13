/**
 * Shared constants and utilities for agent skills prompt building.
 * Used by AgentSetupCallout (full banner) and inline copy-prompt buttons.
 */

export const SKILLS_BASE_URL = 'https://skills.sentry.dev';

/** Single entrypoint skill that instruments any SDK; the SDK is named in prose. */
export const INSTRUMENT_SKILL_URL = `${SKILLS_BASE_URL}/instrument`;

export function buildPrompt(sdkName?: string): string {
  const target = sdkName ? `the Sentry ${sdkName} SDK` : 'Sentry';
  return `Use curl to download, read and follow ${INSTRUMENT_SKILL_URL} to set up ${target}.`;
}

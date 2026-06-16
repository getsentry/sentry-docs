/**
 * Shared constants and utilities for agent skills prompt building.
 * Used by AgentSkillsCallout (full banner) and inline copy-prompt buttons.
 */

export const SKILLS_BASE_URL = 'https://skills.sentry.dev';
export const SKILLS_REPO = 'getsentry/sentry-for-ai';

export function buildPromptUrl(skill?: string): string {
  if (!skill) {
    return SKILLS_BASE_URL + '/';
  }
  return `${SKILLS_BASE_URL}/${skill}/SKILL.md`;
}

export function buildPrompt(skill?: string): string {
  const url = buildPromptUrl(skill);
  return `Use curl to download, read and follow: ${url}`;
}

export function buildDotagentsCommand(skill?: string): string {
  if (!skill) {
    return `npx @sentry/dotagents add ${SKILLS_REPO} --all`;
  }
  return `npx @sentry/dotagents add ${SKILLS_REPO} --name ${skill}`;
}

export function buildNpxSkillsCommand(skill?: string): string {
  if (!skill) {
    return `npx skills add ${SKILLS_REPO}`;
  }
  return `npx skills add ${SKILLS_REPO} --skill ${skill}`;
}

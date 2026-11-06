/**
 * Shared constants for the Sentry CLI setup prompt.
 * Used by the setup callout, the homepage card, and inline copy buttons.
 */

export const SENTRY_CLI_URL = 'https://cli.sentry.dev/';

/**
 * Install commands from https://cli.sentry.dev/.
 * curl, PowerShell, Homebrew, and npx cover the common paths.
 * npm, pnpm, and bun are the same global Node install as each other, so npx stands in for them.
 */
export const CLI_INSTALL_METHODS = [
  {
    id: 'curl',
    label: 'curl',
    command: 'curl https://cli.sentry.dev/install -fsS | bash',
  },
  {
    id: 'powershell',
    label: 'powershell',
    command: 'irm https://cli.sentry.dev/install.ps1 | iex',
  },
  {
    id: 'brew',
    label: 'brew',
    command: 'brew install getsentry/tools/sentry',
  },
  {
    id: 'npx',
    label: 'npx',
    command: 'npx sentry@latest',
  },
] as const;

export type CliInstallMethodId = (typeof CLI_INSTALL_METHODS)[number]['id'];

export function setupTarget(sdkName?: string): string {
  return sdkName ? `the Sentry ${sdkName} SDK` : 'Sentry';
}

export function buildPrompt(sdkName?: string): string {
  const install = CLI_INSTALL_METHODS[0].command;
  return `Set up ${setupTarget(sdkName)} with the Sentry CLI. Install the CLI with \`${install}\`, then follow ${SENTRY_CLI_URL} to finish setup.`;
}

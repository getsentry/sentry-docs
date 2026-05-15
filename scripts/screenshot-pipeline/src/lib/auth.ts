/**
 * Sentry Auth Helper
 *
 * Handles Playwright browser authentication against Sentry.
 * Supports two modes:
 *   1. Storage state file (cookie replay from interactive session)
 *   2. API token injection as a cookie/header
 *
 * For POC, we use mode 1: pre-captured storageState.json.
 */

import {Browser, BrowserContext, chromium} from 'playwright';
import * as fs from 'fs';
import {PipelineConfig} from './types';

export interface AuthenticatedSession {
  browser: Browser;
  context: BrowserContext;
}

/**
 * Launch an authenticated Playwright browser session.
 *
 * @param config Pipeline config containing auth settings
 * @returns Browser and context ready for navigation
 */
export async function createAuthenticatedSession(
  config: PipelineConfig
): Promise<AuthenticatedSession> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu', '--disable-software-rasterizer'],
  });

  const contextOptions: Parameters<Browser['newContext']>[0] = {
    viewport: {width: 1280, height: 800},
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    // Reduce motion for consistent screenshots
    reducedMotion: 'reduce',
  };

  // Load storage state if available
  if (config.storage_state_path) {
    if (!fs.existsSync(config.storage_state_path)) {
      console.warn(
        `\nWarning: Auth state not found at ${config.storage_state_path}\n` +
          'Run "npm run auth:setup" to log in and save your session.\n' +
          'Proceeding without authentication -- captures of protected pages will fail.\n'
      );
    } else {
      console.log(`Loading auth state from: ${config.storage_state_path}`);
      contextOptions.storageState = config.storage_state_path;
    }
  } else {
    console.warn('Warning: No storage state path configured. Proceeding without authentication.');
  }

  const context = await browser.newContext(contextOptions);

  // Set default navigation timeout
  context.setDefaultNavigationTimeout(config.capture_timeout_ms);
  context.setDefaultTimeout(config.wait_for_selector_timeout_ms);

  return {browser, context};
}

/**
 * Check if the current page is on a login/auth redirect.
 * If we end up on a login page, the auth state has expired.
 */
export function isAuthRedirect(url: string): boolean {
  const authPatterns = [
    '/auth/login',
    '/auth/sso',
    '/auth/',
    '/login',
    'accounts.google.com',
    'login.microsoftonline.com',
  ];
  return authPatterns.some(pattern => url.includes(pattern));
}

/**
 * Resolve the org slug placeholder in a URL.
 *
 * Supports two formats:
 *   - Customer domain: transforms to https://{org}.sentry.io/{path}
 *     e.g., https://demo.sentry.io/issues/
 *   - Legacy format: https://sentry.io/organizations/{org}/{path}
 *
 * Set SENTRY_BASE_URL env var to use customer domain format.
 * e.g., SENTRY_BASE_URL=https://demo.sentry.io
 */
export function resolveOrgUrl(url: string, orgSlug: string): string {
  const baseUrl = process.env.SENTRY_BASE_URL;

  if (baseUrl) {
    // Customer domain format: strip the sentry.io prefix and rebuild
    // Input:  https://sentry.io/organizations/{org}/issues/
    // Output: https://demo.sentry.io/issues/
    const pathMatch = url.match(
      /https?:\/\/sentry\.io\/organizations\/\{org\}\/(.*)$/
    );
    if (pathMatch) {
      return `${baseUrl.replace(/\/$/, '')}/${pathMatch[1]}`;
    }

    // Handle settings URLs: https://sentry.io/settings/{org}/...
    // -> https://demo.sentry.io/settings/...
    const settingsMatch = url.match(
      /https?:\/\/sentry\.io\/settings\/\{org\}\/(.*)$/
    );
    if (settingsMatch) {
      return `${baseUrl.replace(/\/$/, '')}/settings/${settingsMatch[1]}`;
    }

    // Handle settings URLs without {org}: https://sentry.io/settings/account/...
    const accountSettingsMatch = url.match(
      /https?:\/\/sentry\.io\/settings\/account\/(.*)$/
    );
    if (accountSettingsMatch) {
      return `${baseUrl.replace(/\/$/, '')}/settings/account/${accountSettingsMatch[1]}`;
    }
  }

  // Legacy format fallback: just replace {org}
  return url.replace(/\{org\}/g, orgSlug);
}

/**
 * Close the browser session gracefully.
 */
export async function closeSession(session: AuthenticatedSession): Promise<void> {
  try {
    await session.context.close();
    await session.browser.close();
  } catch {
    // Best effort cleanup
  }
}

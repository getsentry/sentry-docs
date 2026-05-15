import {defineConfig} from 'playwright/test';

export default defineConfig({
  timeout: 60_000,
  use: {
    // Default browser settings for screenshot capture
    browserName: 'chromium',
    viewport: {width: 1280, height: 800},
    // Reduce motion and animations for consistent captures
    reducedMotion: 'reduce',
    // Default navigation timeout
    navigationTimeout: 30_000,
    // Consistent locale and timezone
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    // Disable GPU for consistent rendering in CI
    launchOptions: {
      args: ['--disable-gpu', '--disable-software-rasterizer'],
    },
  },
  // No test runner -- we use Playwright as a library
  // This config is imported by capture scripts for consistent defaults
});

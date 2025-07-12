// Minimal stub for @sentry/nextjs so that TypeScript can resolve the module
// during local development and preview builds. The real package ships its own
// types, but CI environments without full Node resolution may still need this.

declare module '@sentry/nextjs';

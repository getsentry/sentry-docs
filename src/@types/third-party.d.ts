declare module '@farmfe/core';

declare module '@rspack/core';

declare module '@rspack/core/dist/config/types';

declare module 'rolldown';

declare module 'rolldown/dist/types/plugin';

declare module '@spotlightjs/sidecar/constants';

declare module '@sentry/types';

declare module '@sentry/types' {
  // Minimal Envelope type to satisfy imports
  export type Envelope = unknown;
}

// -------------------- Rollup missing exports --------------------
declare module 'rollup' {
  export interface AcornNode extends Record<string, unknown> {}
  // fallback placeholders
  export interface SourceMapInput extends Record<string, unknown> {}
  export interface EmittedAsset extends Record<string, unknown> {}
  export interface PluginContextMeta extends Record<string, unknown> {}
  export type Plugin<T = any> = any;
}

declare module 'rollup/parseAst' {
  export function parseAst(code: string): unknown;
  export function parseAstAsync(code: string): Promise<unknown>;
}

// Generic placeholders for mdx-bundler generics
declare type ExportedObject = Record<string, unknown>;
declare type Frontmatter = Record<string, unknown>;

// Provide missing iterator type aliases used in some Next.js type declarations
// See: node_modules/next/dist/server/web/spec-extension/adapters/headers.d.ts
//      node_modules/next/dist/compiled/@edge-runtime/cookies/index.d.ts
// They reference `HeadersIterator` and `MapIterator` which are not globally defined.

type MapIterator<T> = Iterator<T>;
type HeadersIterator<T> = Iterator<T>;

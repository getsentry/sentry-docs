declare module '@farmfe/core';

declare module '@rspack/core';

declare module '@rspack/core/dist/config/types';

declare module 'rolldown';

declare module 'rolldown/dist/types/plugin';

declare module '@spotlightjs/sidecar/constants';

// rollup/parseAst helper (only this specific path is missing)
declare module 'rollup/parseAst' {
  export function parseAst(code: string): unknown;
  export function parseAstAsync(code: string): Promise<unknown>;
}

// Augment rollup types to add removed interfaces used by older plugins
declare module 'rollup' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface AcornNode extends Record<string, unknown> {}
}

// Generic placeholders for mdx-bundler generics used in their .d.ts
declare type ExportedObject = Record<string, unknown>;
declare type Frontmatter = Record<string, unknown>;

// Provide missing iterator type aliases used in some Next.js type declarations
// See: node_modules/next/dist/server/web/spec-extension/adapters/headers.d.ts
//      node_modules/next/dist/compiled/@edge-runtime/cookies/index.d.ts
// They reference `HeadersIterator` and `MapIterator` which are not globally defined.

type MapIterator<T> = Iterator<T>;
type HeadersIterator<T> = Iterator<T>;

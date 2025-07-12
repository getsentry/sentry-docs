declare module '@farmfe/core';

declare module '@farmfe/core' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type JsPlugin = any;
}

declare module '@rspack/core' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Compiler = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Compilation = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type LoaderContext<T = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type RspackPluginInstance = any;
}

declare module '@rspack/core/dist/config/types' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type RspackPluginInstance = any;
}

declare module 'rolldown' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Plugin<T = any> = any;
}

declare module 'rolldown/dist/types/plugin' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Plugin<T = any> = any;
}

declare module '@spotlightjs/sidecar/constants';

// rollup/parseAst helper (only this specific path is missing)
declare module 'rollup/parseAst' {
  export function parseAst(code: string): unknown;
  export function parseAstAsync(code: string): Promise<unknown>;
}

// Augment rollup types to add removed interfaces used by older plugins

// Generic placeholders for mdx-bundler generics used in their .d.ts
declare type ExportedObject = Record<string, unknown>;
declare type Frontmatter = Record<string, unknown>;

// Provide missing iterator type aliases used in some Next.js type declarations
// See: node_modules/next/dist/server/web/spec-extension/adapters/headers.d.ts
//      node_modules/next/dist/compiled/@edge-runtime/cookies/index.d.ts
// They reference `HeadersIterator` and `MapIterator` which are not globally defined.

type MapIterator<T> = Iterator<T>;
type HeadersIterator<T> = Iterator<T>;

// Generic fallbacks for compilation context used by unplugin
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CompilationContext = any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LoaderContext<T = any> = any;

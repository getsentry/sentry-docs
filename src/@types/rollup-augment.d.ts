declare module 'rollup' {
  // These auxiliary types were removed from Rollup v4 but are still referenced
  // by some third-party declaration files (vite, unplugin, @sentry plugins, etc.).
  // We re-introduce them here as minimal placeholders so that `skipLibCheck:false`
  // succeeds without having to pin old Rollup versions.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface SourceMapInput extends Record<string, any> {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface EmittedAsset extends Record<string, any> {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface PluginContextMeta extends Record<string, any> {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type AcornNode = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Plugin<T = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PluginHooks = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type RollupError = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type SourceMap = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ModuleInfo = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PartialResolvedId = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type RollupOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type InputOption = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ModuleFormat = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type WatcherOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type RollupOutput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type RollupWatcher = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type InputOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type CustomPluginOptions = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type LoadResult = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type SourceDescription = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ResolveIdResult = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ExistingRawSourceMap = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type GetManualChunk = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type TransformPluginContext = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type TransformResult = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PluginContext = any;
}
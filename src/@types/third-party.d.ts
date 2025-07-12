declare module 'webpack';

declare module 'rollup';

declare module 'rollup/parseAst';

declare module '@farmfe/core';

declare module '@rspack/core';

declare module '@rspack/core/dist/config/types';

declare module 'rolldown';

declare module 'rolldown/dist/types/plugin';

declare module '@spotlightjs/sidecar/constants';

declare module '@sentry/types';

// Provide missing iterator type aliases used in some Next.js type declarations
// See: node_modules/next/dist/server/web/spec-extension/adapters/headers.d.ts
//      node_modules/next/dist/compiled/@edge-runtime/cookies/index.d.ts
// They reference `HeadersIterator` and `MapIterator` which are not globally defined.

type MapIterator<T> = Iterator<T>;
type HeadersIterator<T> = Iterator<T>;
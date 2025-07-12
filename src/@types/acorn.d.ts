// Stub type declarations for the `acorn` parser when its own types are not available.
// We only export `any` values to satisfy TypeScript without enforcing acorn's API surface.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'acorn' {
  const acorn: any;
  export = acorn;
}

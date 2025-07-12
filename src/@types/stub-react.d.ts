declare module 'react' {
  // Minimal stub to satisfy TypeScript when full React types are unavailable.
  // We purposefully use `any` here because the actual types are provided by
  // `@types/react` during development, but they may be missing in certain CI
  // environments. This prevents the compiler from erroring out.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const React: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export = React;
}

declare module 'react-dom' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ReactDOM: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export = ReactDOM;
}
/**
 * Local implementation of getMDXComponent from mdx-bundler/client.
 *
 * This eliminates the runtime dependency on mdx-bundler/client which has
 * CJS/ESM compatibility issues when loaded in Vercel serverless functions.
 * The mdx-bundler package uses "type": "module" but the client/ subdirectory
 * uses CommonJS require() to load ../dist/client.js, causing:
 *   "require() of ES Module not supported"
 *
 * Since getMDXComponent only needs React at runtime (and the compiled MDX code
 * is just a string), we can safely inline this implementation.
 *
 * Fixes: DOCS-A0W
 * @see https://github.com/kentcdodds/mdx-bundler/blob/main/src/client.js
 */
import type {ComponentType, FunctionComponent} from 'react';
// These namespace imports are required - the MDX runtime expects React, ReactDOM,
// and jsx_runtime objects in scope to call methods like React.createElement()
// eslint-disable-next-line no-restricted-imports
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
// eslint-disable-next-line no-restricted-imports
import * as ReactDOM from 'react-dom';

export interface MDXContentProps {
  [key: string]: unknown;
  components?: Record<string, ComponentType>;
}

/**
 * Takes the compiled MDX code string from bundleMDX and returns a React component.
 *
 * @param code - The string of code you got from bundleMDX
 * @param globals - Any variables your MDX needs to have accessible when it runs
 * @returns A React component that renders the MDX content
 */
export function getMDXComponent(
  code: string,
  globals?: Record<string, unknown>
): FunctionComponent<MDXContentProps> {
  const mdxExport = getMDXExport(code, globals);
  return mdxExport.default;
}

/**
 * Takes the compiled MDX code string from bundleMDX and returns all exports.
 *
 * @param code - The string of code you got from bundleMDX
 * @param globals - Any variables your MDX needs to have accessible when it runs
 * @returns All exports from the MDX module, including the default component
 */
export function getMDXExport<
  ExportedObject = {default: FunctionComponent<MDXContentProps>},
>(code: string, globals?: Record<string, unknown>): ExportedObject {
  const scope = {
    React,
    ReactDOM,
    _jsx_runtime: jsxRuntime,
    ...globals,
  };
  // The MDX runtime requires dynamic function construction to evaluate compiled code
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope));
}

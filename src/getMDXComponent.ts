/**
 * Local implementation of getMDXComponent replacing mdx-bundler/client.
 *
 * Eliminates the runtime dependency on mdx-bundler/client which has CJS/ESM
 * compatibility issues in Vercel serverless functions. Since getMDXComponent
 * only needs React at runtime, we can safely inline this implementation.
 *
 * @see https://github.com/kentcdodds/mdx-bundler/blob/main/src/client.js
 */
import type {ComponentType, FunctionComponent} from 'react';
// Namespace imports required - MDX runtime expects React, ReactDOM, jsx_runtime in scope
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
 * Takes compiled MDX code from bundleMDX and returns a React component.
 */
export function getMDXComponent(
  code: string,
  globals?: Record<string, unknown>
): FunctionComponent<MDXContentProps> {
  return getMDXExport(code, globals).default;
}

/**
 * Takes compiled MDX code from bundleMDX and returns all exports.
 */
export function getMDXExport<
  ExportedObject = {default: FunctionComponent<MDXContentProps>},
>(code: string, globals?: Record<string, unknown>): ExportedObject {
  const scope = {React, ReactDOM, _jsx_runtime: jsxRuntime, ...globals};
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope));
}

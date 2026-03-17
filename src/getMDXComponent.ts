/**
 * Evaluates compiled MDX code and returns a React component.
 *
 * Supports both output formats:
 * - @mdx-js/mdx compile() with outputFormat: 'function-body'
 *   → uses arguments[0] for jsx runtime
 * - Legacy mdx-bundler output (IIFE accessing named scope variables)
 *   → uses named params: React, ReactDOM, _jsx_runtime
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
 * Takes compiled MDX code and returns a React component.
 */
export function getMDXComponent(
  code: string,
  globals?: Record<string, unknown>
): FunctionComponent<MDXContentProps> {
  return getMDXExport(code, globals).default;
}

/**
 * Takes compiled MDX code and returns all exports.
 *
 * @mdx-js/mdx function-body output destructures jsx runtime from arguments[0]:
 *   const {Fragment, jsx, jsxs} = arguments[0];
 *
 * We pass jsxRuntime as the sole argument to new Function(code).
 */
export function getMDXExport<
  ExportedObject = {default: FunctionComponent<MDXContentProps>},
>(code: string, globals?: Record<string, unknown>): ExportedObject {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const fn = new Function(code);
  return fn({...jsxRuntime, React, ReactDOM, ...globals});
}

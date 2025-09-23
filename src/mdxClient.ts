/* eslint-disable no-new-func */
import * as React from 'react';
import * as jsxDevRuntime from 'react/jsx-dev-runtime';
import * as jsxRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';

type Globals = Record<string, unknown> | undefined;

type MdxExport<T = Record<string, unknown>> = T & {
  default: React.ComponentType<any>;
};

function getRuntime() {
  return process.env.NODE_ENV === 'production' ? jsxRuntime : jsxDevRuntime;
}

export function getMDXExport<T extends MdxExport = MdxExport>(
  code: string,
  globals?: Globals
): T {
  const scope = {
    React,
    ReactDOM,
    _jsx_runtime: getRuntime(),
    ...globals,
  };

  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope));
}

export function getMDXComponent<Component extends React.ComponentType<any>>(
  code: string,
  globals?: Globals
): Component {
  const mdxExport = getMDXExport<MdxExport<{default: Component}>>(code, globals);
  return mdxExport.default;
}

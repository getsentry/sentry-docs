import {Fragment} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import bash from 'refractor/lang/bash.js';
import json from 'refractor/lang/json.js';
import typescript from 'refractor/lang/typescript.js';
import {refractor} from 'refractor/lib/core.js';

refractor.register(bash);
refractor.register(json);
refractor.register(typescript);

// If a new language should be supported, add it here and register it in refractor above
export const SUPPORTED_LANGUAGES = ['bash', 'json', 'typescript'];

export function codeToJsx(code: string, lang = 'json') {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    // eslint-disable-next-line no-console
    console.error(`Unsupported language for syntax highlighting: ${lang}`);
  }
  return toJsxRuntime(refractor.highlight(code, lang) as Nodes, {Fragment, jsx, jsxs});
}

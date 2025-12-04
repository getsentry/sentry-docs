import {Fragment} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import bash from 'refractor/lang/bash.js';
import groovy from 'refractor/lang/groovy.js';
import javascript from 'refractor/lang/javascript.js';
import json from 'refractor/lang/json.js';
import kotlin from 'refractor/lang/kotlin.js';
import python from 'refractor/lang/python.js';
import typescript from 'refractor/lang/typescript.js';
import {refractor} from 'refractor/lib/core.js';

refractor.register(bash);
refractor.register(groovy);
refractor.register(javascript);
refractor.register(json);
refractor.register(kotlin);
refractor.register(python);
refractor.register(typescript);

// If a new language should be supported, add it here and register it in refractor above
export const SUPPORTED_LANGUAGES = [
  'bash',
  'groovy',
  'javascript',
  'json',
  'kotlin',
  'python',
  'typescript',
];

export function codeToJsx(code: string, lang = 'json') {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    // eslint-disable-next-line no-console
    console.error(`Unsupported language for syntax highlighting: ${lang}`);
  }
  return toJsxRuntime(refractor.highlight(code, lang) as Nodes, {Fragment, jsx, jsxs});
}

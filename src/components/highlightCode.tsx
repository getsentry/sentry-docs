import {Fragment} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import bash from 'refractor/lang/bash.js';
import c from 'refractor/lang/c.js';
import cpp from 'refractor/lang/cpp.js';
import csharp from 'refractor/lang/csharp.js';
import go from 'refractor/lang/go.js';
import java from 'refractor/lang/java.js';
import json from 'refractor/lang/json.js';
import kotlin from 'refractor/lang/kotlin.js';
import objectivec from 'refractor/lang/objectivec.js';
import php from 'refractor/lang/php.js';
import python from 'refractor/lang/python.js';
import ruby from 'refractor/lang/ruby.js';
import rust from 'refractor/lang/rust.js';
import swift from 'refractor/lang/swift.js';
import typescript from 'refractor/lang/typescript.js';
import {refractor} from 'refractor/lib/core.js';

refractor.register(bash);
refractor.register(json);
refractor.register(typescript);
refractor.register(python);
refractor.register(java);
refractor.register(c);
refractor.register(cpp);
refractor.register(kotlin);
refractor.register(csharp);
refractor.register(rust);
refractor.register(swift);
refractor.register(ruby);
refractor.register(objectivec);
refractor.register(php);
refractor.register(go);

export function codeToJsx(code: string, lang = 'json') {
  return toJsxRuntime(refractor.highlight(code, lang) as Nodes, {Fragment, jsx, jsxs});
}

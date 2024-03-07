import {format} from 'prettier';
import {visit} from 'unist-util-visit';

import * as prettierConfig from '../prettier.config.js';

export default function remarkFormatCodeBlocks() {
  return async tree => {
    const codeNodes = [];
    visit(tree, 'code', node => {
      codeNodes.push(node);
    });
    const formattingWork = codeNodes
      // skip code blocks with diff meta as they might have
      // broken syntax due to + and - characters
      .filter(node => !node.meta?.includes('diff'))
      .map(node => formatCode(node));

    await Promise.all(formattingWork);
  };
}

async function formatCode(node) {
  const lang = node.lang;
  const parsersConfigs = {
    javascript: {parser: 'babel'},
    jsx: {parser: 'babel'},
    typescript: {parser: 'babel-ts'},
    tsx: {parser: 'babel-ts'},
    html: {parser: 'html'},
    css: {parser: 'css'},
    json: {parser: 'json'},
    markdown: {parser: 'markdown'},
    yaml: {parser: 'yaml'},
    yml: {parser: 'yaml'},
    xml: {parser: 'xml', plugins: ['@prettier/plugin-xml']},
  };
  const parserConfig = parsersConfigs[lang];
  if (!parserConfig) {
    return;
  }

  try {
    const formattedCode = await format(node.value, {...prettierConfig, ...parserConfig});
    // get rid of the trailing newline
    node.value = formattedCode.trimEnd();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`⚠️  Error formatting code block\n${e.message}`);
  }
}

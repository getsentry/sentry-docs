import {format} from 'prettier';
import {visit} from 'unist-util-visit';

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
  const parsers = {
    javascript: 'babel',
    jsx: 'babel',
    typescript: 'babel-ts',
    tsx: 'babel-ts',
    html: 'html',
    css: 'css',
    json: 'json',
    markdown: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
  };
  const parser = parsers[lang];
  if (!parser) {
    return;
  }

  try {
    const formattedCode = await format(node.value, {parser: parsers[lang]});
    // get rid of the trailing newline
    node.value = formattedCode.trimEnd();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`⚠️  Error formatting code block\n${e.message}`);
  }
}

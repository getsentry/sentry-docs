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
      // or with `onboardingOptions` as they need to have predictable line numbers
      .filter(
        node => !(node.meta?.includes('diff') || node.meta?.includes('onboardingOptions'))
      )
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
    const formattedCode = await format(node.value, {
      printWidth: 75, // The code blocks in the docs have around 77 characters available on desktop
      ...parserConfig,
    });
    // get rid of the trailing newline
    node.value = formattedCode.trimEnd();
  } catch (e) {
    // noop - logging here would spam the build logs to a degree of unusability
  }
}

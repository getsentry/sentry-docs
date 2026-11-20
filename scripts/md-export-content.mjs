import {selectAll} from 'hast-util-select';

/** Use the SDK's visible H1 for Markdown, while other pages retain their HTML title. */
export function selectMarkdownContent(tree) {
  const selected = selectAll(
    'head > title, head > link[rel="canonical"], hgroup > h1 > span[data-md-heading], div#main',
    tree
  );
  const sdkHeading = selected.find(node => node.tagName === 'span');
  return selected
    .filter(node => !sdkHeading || node.tagName !== 'title')
    .map(node => (node === sdkHeading ? {...node, tagName: 'title'} : node));
}

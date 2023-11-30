// WIP Plugin to define global glossary of terminology. Parts of remark-abbr
// were vendored, particularly around auto-linking definitions and walking the
// markdown AST. Currently the global glossary needs to be defined in-source.
// It's unlikely that there is a way to define glossary in a separate markdown
// file without blocking all pages processing on processing the glossary file.
//
// remark-abbr is Copyright (c) Zeste de Savoir (https://zestedesavoir.com)
// https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-abbr

const visit = require('unist-util-visit');

const TERMS = {
  fingerprint: 'The set of characteristics that define an event.',
  quota: 'The monthly number of events that you pay Sentry to track.',
  SaaS: "Sentry's cloud-based, software-as-a-service solution.",
  token:
    'In search, a key-value pair or raw search term. Also, a value used for authorization.',
  tracing:
    'The process of logging the events that took place during a request, often across multiple services.',
  project:
    'Represents your service in Sentry and allows you to scope events to a distinct application.',
  DSN: 'The Data Source Name (DSN) key tells the Sentry SDK where to send events, ensuring they go to the right project.',
};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

const PATTERN = Object.keys(TERMS).map(escapeRegExp).join('|');
const REGEX = new RegExp(`(\\b|\\W)(${PATTERN})(\\b|\\W)`);
const CUSTOM_LINK_START = new RegExp('^<([a-zA-Z]+Link|a) ');
const CUSTOM_LINK_END = new RegExp('^</([a-zA-Z]+Link|a)>');

function replace(state, node) {
  if (node.type === 'root') {
    return undefined;
  }

  // If this is an empty node there's nothing to consider.
  if (!node.children) {
    return 'skip';
  }

  // Do not replace abbreviations in headings because that appears to break the heading anchors.
  if (node.type === 'heading') {
    state.alreadyExplained = {};
    return 'skip';
  }

  // Do not replace abbreviations in links because that's two interactive
  // nested elements nested in each other, and we decided we don't want to
  // style that either.
  //
  // This currently doesn't handle nesting of e.g.
  // <a><strong><abbr>... but we don't have that in docs.
  if (node.type === 'link') {
    return 'skip';
  }

  let insideCustomLink = false;

  const newChildren = [];

  // If a text node is present in child nodes, check if an abbreviation is present
  for (let c = 0; c < node.children.length; c++) {
    const child = node.children[c];

    // While iterating through children, keep track of whether we're in a
    // custom link component or not. MDX components have their own AST type,
    // which is indirectly documented by the remark-mdx plugin:
    //
    // * https://www.npmjs.com/package/remark-mdx
    // * ...links to: https://github.com/syntax-tree/mdast-util-mdx-jsx#nodes
    //
    // So the node type we'd have to check for is 'mdxJsxTextElement'.
    //
    // ...except that's not actually what we seem to use, and instead MDX
    // defines its own node type here: https://github.com/mdx-js/specification#jsx-1
    //
    // So according to that README's example, a markdown file like
    // `<PlatformLink to=...>hello</PlatformLink>` would be parsed as:
    //
    // { "type": "jsx", "value": "<PlatformLink to=...>hello</PlatformLink>" }
    //
    // ...which however is also completely wrong, as the actual AST we appear
    // to end up with is (found by trial and error):
    //
    // {
    //   "type": ???,
    //   "children": [
    //     {"type": "jsx": "value": "<PlatformLink to=...>"},
    //     {"type": "text": "value": "hello"},
    //     {"type": "jsx": "value": "</PlatformLink>"}
    //   ]
    // }
    //
    // So in short, MDX defines an AST layout, remark-mdx defines an AST
    // layout, both packages are part of our dependency tree, and somehow in
    // our build process we end up with neither format.
    if (child.type === 'jsx' && child.value) {
      if (CUSTOM_LINK_START.test(child.value)) {
        insideCustomLink = true;
      } else if (CUSTOM_LINK_END.test(child.value)) {
        insideCustomLink = false;
      }
    }

    if (insideCustomLink || child.type !== 'text' || !REGEX.test(child.value)) {
      newChildren.push(child);
      continue;
    }

    // Transform node
    const newTexts = child.value.split(REGEX);

    // Replace abbreviations
    for (let i = 0; i < newTexts.length; i++) {
      const content = newTexts[i];
      let newNode;
      if (TERMS[content] && !state.alreadyExplained[content]) {
        state.alreadyExplained[content] = true;
        newNode = {
          type: 'html',
          value: `<div class="term-wrapper"><span class="term">${content}</span><span class="description" role="tooltip" aria-label="${content} definition">${TERMS[content]}</span></div>`,
        };
      } else {
        newNode = {
          type: 'text',
          value: content,
        };
      }

      newChildren.push(newNode);
    }
  }

  node.children = newChildren;

  return undefined;
}

module.exports = ({markdownAST}) => {
  const state = {
    alreadyExplained: {},
  };
  const replaceWithState = replace.bind(null, state);
  visit(markdownAST, () => true, replaceWithState);
};

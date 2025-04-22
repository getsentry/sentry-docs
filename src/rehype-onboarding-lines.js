/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */
import {toString} from 'hast-util-to-string';
import {visit} from 'unist-util-visit';

/**
 * a Rehype plugin that adds the `data-onboarding-option="option-id"` attribute and `hidden` class name
 * to each line of code enclosed within a `___PRODUCT_OPTION_START___ option-id` and `___PRODUCT_OPTION_END___ option-id` markers.
 *
 * These lines will be hidden by default and shown based on the user's selection of `<OnboardingOptionsButtons ... />`
 *
 * **Note**: This plugin should be used after `rehype-prism-plus` as it relies on its output.
 *
 * @return {import('unified').Plugin<[], Root>}
 */
export default function rehypeOnboardingLines() {
  return tree => {
    visit(tree, {type: 'element', tagName: 'code'}, visitor);
  };
}

/**
 * @param {Element} node
 */
function visitor(node) {
  // ignore no code-highlight <code> tags as in in inline code resulting from a `markdown`
  if (!node.properties.className?.includes('code-highlight')) {
    return;
  }
  handle_inline_options(node);
}

function handle_inline_options(node) {
  /* @type {string | undefined} */
  let currentOption;

  // product options syntax
  // ___PRODUCT_OPTION_START___ session-replay
  // some lines here
  // ___PRODUCT_OPTION_END___ session-replay
  const PRODUCT_OPTION_START = '___PRODUCT_OPTION_START___';
  const PRODUCT_OPTION_END = '___PRODUCT_OPTION_END___';
  node.children?.forEach(line => {
    const lineStr = toString(line);
    if (lineStr.includes(PRODUCT_OPTION_START)) {
      currentOption = /___PRODUCT_OPTION_START___ ([-\w]+)/.exec(lineStr)?.[1].trim();
      line.properties['data-onboarding-option-hidden'] = '1';
    } else if (lineStr.includes(PRODUCT_OPTION_END)) {
      line.properties['data-onboarding-option-hidden'] = '1';
      currentOption = undefined;
    }
    if (currentOption) {
      line.properties['data-onboarding-option'] = currentOption;
    }
  });
}

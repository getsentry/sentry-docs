/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */
import {toString} from 'hast-util-to-string';

import rangeParser from 'parse-numeric-range';
import {visit} from 'unist-util-visit';

/**
 * Rehype plugin that adds the `data-onboarding-option="some-option-id"` attribute and `hidden` class name
 * to each line of code based on the metastring of the code block.
 *
 * The metastring should be in the format of:
 * `{"onboardingOptions": {"performance": "1, 3-4", "profiling": "5-6"}}`
 * where the keys are the onboarding options, the line numbers can be individual or ranges separated by a comma.
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

  /* @type {string | undefined} */
  let currentOption;

  // product options syntax
  // ___product_option_start___ performance
  // some lines here
  // ___product_option_end___ performance
  const PRODUCT_OPTION_START = '___product_option_start___';
  const PRODUCT_OPTION_END = '___product_option_end___';
  node.children?.forEach(line => {
    const lineStr = toString(line);
    if (lineStr.includes(PRODUCT_OPTION_START)) {
      currentOption = lineStr.split(PRODUCT_OPTION_START)[1].trim();
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

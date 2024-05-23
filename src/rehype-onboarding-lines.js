/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */

import rangeParser from 'parse-numeric-range';
import {visit} from 'unist-util-visit';

/**
 * Rehype plugin that adds the `data-onboarding-option="some-option-id"` attribute and `hidden` class name
 * to each line of code based on the metastring of the code block.
 *
 * The metastring should be in the format of:
 * `{onboardingOptions: {performance: '1, 3-4', profiling: '5-6'}}`
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
    visit(tree, onlyHighlitedCodeBlocks, visitor);
  };
}
/**
 * Parse the line numbers from the metastring
 * @param {string} meta
 * @return {number[]}
 * @example
 * parseLines('1, 3-4') // [1, 3, 4]
 * parseLines('') // []
 */
const parseLines = meta => {
  const RE = /([\d,-]+)/;
  // Remove space between {} e.g. {1, 3}
  const parsedMeta = meta
    .split(',')
    .map(str => str.trim())
    .join(',');
  if (RE.test(parsedMeta)) {
    const strlineNumbers = RE.exec(parsedMeta)?.[1];
    if (!strlineNumbers) {
      return [];
    }
    const lineNumbers = rangeParser(strlineNumbers);
    return lineNumbers;
  }
  return [];
};

/**
 * Create a closure that returns an onboarding option `id` for a given line if it exists
 *
 * @param {string} meta
 * @return { (index:number) => string | undefined }
 */
const getOptionForLine = meta => {
  const optionsRE = /{.*onboardingOptions:(.*)}/i;
  let linesForOptions = {};
  const options = optionsRE.exec(meta)?.[1];
  if (!options) {
    return () => undefined;
  }
  // eval provides the convenience of not having to wrap the object properties in quotes
  // eslint-disable-next-line no-eval
  const parsedOptions = eval(`(${options})`);
  linesForOptions = Object.keys(parsedOptions).reduce((acc, key) => {
    acc[key] = parseLines(parsedOptions[key]);
    return acc;
  }, {});
  return index => {
    for (const key in linesForOptions) {
      if (linesForOptions[key].includes(index + 1)) {
        return key;
      }
    }
    return undefined;
  };
};

/**
 * @param {Element} node
 */
function visitor(node) {
  const meta = /** @type {string} */ (
    node?.data?.meta || node?.properties?.metastring || ''
  );

  const optionForLine = getOptionForLine(meta);

  node.children.forEach((line, index) => {
    const option = optionForLine(index);
    if (option) {
      line.properties['data-onboarding-option'] = option;
      line.properties.className.push('hidden');
    }
  });
}

/**
 * Check if the node is a code block with the metastring containing `onboardingOptions`
 * @param {Element} node
 * @return {boolean}
 */
const onlyHighlitedCodeBlocks = node =>
  node.tagName === 'code' &&
  (node?.data?.meta || node?.properties?.metastring || '').includes('onboardingOptions');

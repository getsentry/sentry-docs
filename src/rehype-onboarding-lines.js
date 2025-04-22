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
 * The metastring should be in the format of (legacy method):
 * `{"onboardingOptions": {"performance": "1, 3-4", "profiling": "5-6"}}`
 * where the keys are the onboarding options, the line numbers can be individual or ranges separated by a comma.
 *
 * These lines will be hidden by default and shown based on the user's selection of `<OnboardingOptionsButtons ... />`
 *
 * **Note**: This plugin should be used after `rehype-prism-plus` as it relies on its output.
 * **Note**: the recommended way to specify the onboarding options now is to use the inline syntax.
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

  const meta = /** @type {string} */ (
    node?.data?.meta || node?.properties?.metastring || ''
  );

  if (meta.includes('onboardingOptions')) {
    handle_metadata_options(node, meta);
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
  // match the onboardingOptions object, but avoid `other stuff`
  const optionsRE = /{"onboardingOptions":\s*({[^}]*})\s*}/;
  let linesForOptions = {};
  const options = optionsRE.exec(meta)?.[1];
  if (!options) {
    return () => undefined;
  }

  // eval provides the convenience of not having to wrap the object properties in quotes
  const parsedOptions = JSON.parse(options);
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
function handle_metadata_options(node, meta) {
  const optionForLine = getOptionForLine(meta);

  node.children.forEach((line, index) => {
    const option = optionForLine(index);
    if (option) {
      line.properties['data-onboarding-option'] = option;
    }
  });
}

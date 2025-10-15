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

  // First pass: mark lines with options
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

  // Second pass: Mark integrations array opening/closing lines
  // These should be hidden if all content inside is from options that are disabled
  for (let i = 0; i < (node.children?.length ?? 0); i++) {
    const line = node.children[i];
    const lineStr = toString(line).trim();

    // Found "integrations: ["
    if (lineStr.match(/integrations:\s*\[/)) {
      // Mark the opening line
      line.properties['data-integrations-wrapper'] = 'open';

      // Find the closing "]," - must be exactly ],
      let closeIndex = -1;
      for (let j = i + 1; j < node.children.length; j++) {
        const closeStr = toString(node.children[j]).trim();
        if (closeStr === '],') {
          closeIndex = j;
          // Mark the closing line
          node.children[j].properties['data-integrations-wrapper'] = 'close';
          break;
        }
      }

      // Only hide the wrapper by default if ALL content between open and close
      // has data-onboarding-option (meaning it's ALL conditional)
      if (closeIndex !== -1) {
        let hasNonOptionContent = false;
        for (let k = i + 1; k < closeIndex; k++) {
          const contentLine = node.children[k];
          const isMarker = contentLine.properties['data-onboarding-option-hidden'];
          const hasOption = contentLine.properties['data-onboarding-option'];

          // If this line has content and is not a marker and doesn't have an onboarding option,
          // it's always-visible content
          if (!isMarker && !hasOption && toString(contentLine).trim()) {
            hasNonOptionContent = true;
            break;
          }
        }

        // Only hide wrapper by default if ALL content is part of onboarding options
        if (!hasNonOptionContent) {
          const openClasses = Array.isArray(line.properties.className)
            ? line.properties.className
            : line.properties.className
              ? [line.properties.className]
              : [];
          line.properties.className = [...openClasses, 'hidden'];

          const closeClasses = Array.isArray(
            node.children[closeIndex].properties.className
          )
            ? node.children[closeIndex].properties.className
            : node.children[closeIndex].properties.className
              ? [node.children[closeIndex].properties.className]
              : [];
          node.children[closeIndex].properties.className = [...closeClasses, 'hidden'];
        }
      }

      break; // Only handle first integrations array
    }
  }
}

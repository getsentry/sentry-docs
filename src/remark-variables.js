/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */
/* eslint-disable no-console */

import {visit} from 'unist-util-visit';

function scopedEval(expr, context = {}) {
  // eslint-disable-next-line no-new-func
  const evaluator = Function.apply(null, [
    ...Object.keys(context),
    'expr',
    'return eval(expr)',
  ]);
  return evaluator.apply(null, [...Object.values(context), expr]);
}

const matchEach = (text, pattern, callback) => {
  pattern.lastIndex = 0;
  let match, rv;
  const promises = [];
  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(text)) !== null) {
    rv = callback(match);
    if (rv instanceof Promise) {
      promises.push(rv);
    }
  }
  return Promise.all(promises);
};

const isMdxExpression = node =>
  node && (node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression');

const INJECT_PREFIX = '@inject';
const INJECT_SENTINEL_OPEN = 'SENTRYINJECTOPEN';
const INJECT_SENTINEL_CLOSE = 'SENTRYINJECTCLOSE';

const sentinelPattern = new RegExp(
  `${INJECT_SENTINEL_OPEN}${INJECT_PREFIX}([\\s\\S]*?)${INJECT_SENTINEL_CLOSE}`,
  'gi'
);

const mustachePattern = /\{\{\\?@inject([\s\S]*?)\}\}/gi;

function unwrapExpression(value) {
  if (!value) {
    return value;
  }

  const trimmed = value.trim();
  const startsWithQuote = trimmed.startsWith("'") || trimmed.startsWith('"') || trimmed.startsWith('`');
  const endsWithQuote = trimmed.endsWith("'") || trimmed.endsWith('"') || trimmed.endsWith('`');

  if (startsWithQuote && endsWithQuote && trimmed.length >= 2) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function evaluateInjectExpression(expr, scope, page) {
  const expression = expr.trim();

  let result;
  try {
    result = scopedEval(expression, {...scope, page});
  } catch (err) {
    console.error(`Failed to interpolate expression: "${expression}"`);
    throw err;
  }

  if (!result) {
    console.error(new Error(`Failed to interpolate expression: "${expression}"`));
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  return result ?? '';
}

export default function remarkVariables(options) {
  return async (markdownAST, markdownNode) => {
    const page = markdownNode.data?.frontmatter;

    const scope = await options.resolveScopeData();

    visit(
      markdownAST,
      () => true,
      node => {
        // XXX(dcramer): by far the worst template language of all time

        if (!node.value) {
          return;
        }

        if (isMdxExpression(node)) {
          const rawExpression = unwrapExpression(node.value);
          if (!rawExpression?.toLowerCase().startsWith(`${INJECT_PREFIX} `)) {
            return;
          }

          const expr = rawExpression.slice(INJECT_PREFIX.length).trim();
          const result = evaluateInjectExpression(expr, scope, page);

          node.type = 'text';
          node.value = result;
          if (node.data) {
            delete node.data; // remove stale estree metadata from mdx parser
          }

          return;
        }

        matchEach(node.value, sentinelPattern, match => {
          const expr = match[1];
          const result = evaluateInjectExpression(expr, scope, page);
          node.value = node.value.replace(match[0], result);
        });

        // TODO(dcramer): this could be improved by parsing the string piece by piece so you can
        // safely quote template literals e.g. {{ '{{ foo }}' }}
        matchEach(node.value, mustachePattern, match => {
          const matchText = match[0];

          if (matchText.includes('{{\\@inject')) {
            node.value = node.value.replace('\\@inject', '@inject');
            return;
          }

          const expr = match[1].trim();
          const result = evaluateInjectExpression(expr, scope, page);
          node.value = node.value.replace(matchText, result);
        });
      }
    );
  };
}

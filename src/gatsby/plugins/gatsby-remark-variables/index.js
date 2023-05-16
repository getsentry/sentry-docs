/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */
/* eslint-disable no-console */

const visit = require('unist-util-visit');

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

module.exports = async ({markdownAST, markdownNode}, options) => {
  const page = markdownNode.frontmatter;

  const scope = await options.resolveScopeData();

  visit(
    markdownAST,
    () => true,
    node => {
      // XXX(dcramer): by far the worst template language of all time

      if (!node.value) {
        return;
      }

      // TODO(dcramer): this could be improved by parsing the string piece by piece so you can
      // safely quote template literals e.g. {{ '{{ foo }}' }}
      matchEach(node.value, /\{\{\s*([^}]+)\s*\}\}/gi, match => {
        const expr = match[1].replace(/\s+$/, '');

        // Known common value, lets just make life easy
        if (options.excludeExpr.indexOf(expr) !== -1) {
          return;
        }

        // YOU CAN EXECUTE CODE HERE JUST FYI
        let result;
        try {
          result = scopedEval(expr, {...scope, page});
        } catch (err) {
          // no-op. We previously had a warning here, but the we have so many
          // "variable-like" constructs in our codeblocks that this becomes
          // very spammy.
        }
        if (result) {
          node.value = node.value.replace(match[0], result);
        }
      });
    }
  );
};

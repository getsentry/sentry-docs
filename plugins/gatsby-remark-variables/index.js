const visit = require("unist-util-visit");

function scopedEval(expr, context = {}) {
  const evaluator = Function.apply(null, [
    ...Object.keys(context),
    "expr",
    "return eval(expr)",
  ]);
  return evaluator.apply(null, [...Object.values(context), expr]);
}

const matchEach = (text, pattern, callback) => {
  let match, rv;
  let promises = [];
  while ((match = pattern.exec(text)) !== null) {
    rv = callback(match);
    if (rv instanceof Promise) {
      promises.push(rv);
    }
  }
  return Promise.all(promises);
};

module.exports = async ({ markdownAST, markdownNode }, options) => {
  const page = markdownNode.frontmatter;

  visit(
    markdownAST,
    () => true,
    async node => {
      // XXX(dcramer): by far the worst template language of all time

      if (!node.value) {
        return;
      }

      // TODO(dcramer): this could be improved by parsing the string piece by piece so you can
      // safely quote template literals e.g. {{ '{{ foo }}' }}
      matchEach(node.value, /\{\{\s*([^}]+)\s*\}\}/gi, async match => {
        const expr = match[1].replace(/\s+$/, "");

        // Known common value, lets just make life easy
        if (options.excludeExpr.indexOf(expr) !== -1) {
          return;
        }

        // YOU CAN EXECUTE CODE HERE JUST FYI
        let result;
        try {
          result = scopedEval(expr, {
            ...options.scope,
            page,
          });
          if (result instanceof Promise) result = await result;
        } catch (err) {
          console.warn(
            `Error executing variable-like construct: ${match[0]}`,
            err
          );
        }
        if (result) {
          node.value = node.value.replace(match[0], result);
        }
      });
    }
  );
  return markdownAST;
};

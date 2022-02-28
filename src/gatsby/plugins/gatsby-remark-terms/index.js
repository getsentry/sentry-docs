// WIP Plugin to define global glossary of terminology. Parts of remark-abbr
// were vendored, particularly around auto-linking definitions and walking the
// markdown AST. Currently the global glossary needs to be defined in-source.
// It's unlikely that there is a way to define glossary in a separate markdown
// file without blocking all pages processing on processing the glossary file.
//
// remark-abbr is Copyright (c) Zeste de Savoir (https://zestedesavoir.com)
// https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-abbr

const visit = require("unist-util-visit");

const TERMS = {
  DSN: "Data Source Name: Credentials used in SDK to send data to Sentry.",
};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // eslint-disable-line no-useless-escape
}

const PATTERN = Object.keys(TERMS)
  .map(escapeRegExp)
  .join("|");
const REGEX = new RegExp(`(\\b|\\W)(${PATTERN})(\\b|\\W)`);

function replace(node) {
  if (Object.keys(TERMS).length === 0) return;
  if (!node.children) return;

  // If a text node is present in child nodes, check if an abbreviation is present
  for (let c = 0; c < node.children.length; c++) {
    const child = node.children[c];
    if (child.type !== "text") continue;
    if (!REGEX.test(child.value)) continue;

    // Transform node
    const newTexts = child.value.split(REGEX);

    // Remove old text node
    node.children.splice(c, 1);

    // Replace abbreviations
    for (let i = 0; i < newTexts.length; i++) {
      const content = newTexts[i];
      node.children.splice(
        c + i,
        0,
        TERMS[content]
          ? {
              type: "html",
              value: `<abbr title="${TERMS[content]}">${content}</abbr>`,
            }
          : {
              type: "text",
              value: content,
            }
      );
    }
  }
}

module.exports = async ({ markdownAST }) => {
  visit(markdownAST, () => true, replace);
};

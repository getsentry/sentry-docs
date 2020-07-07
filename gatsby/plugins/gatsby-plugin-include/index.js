const visit = require("unist-util-visit");

module.exports = ({ markdownAST }, {}) => {
  const imports = {};
  let idx = 0;

  visit(markdownAST, "import", (node) => {
    const match = node.value.match(/^\s*import\s"([^"]*\.mdx)"\s*;?\s*$/);
    let componentName = null;
    if (match) {
      const path = match[1];
      if (imports[path]) {
        componentName = imports[path].componentName;
      } else {
        imports[path] = {
          componentName: (componentName = `ImportedComponent${idx++}`),
          position: node.position,
        };
      }
    }

    if (componentName) {
      node.type = "jsx";
      node.value = `<${componentName}/>`;
    }
  });

  const importList = Object.entries(imports);
  if (importList.length > 0) {
    markdownAST.children = importList
      .map(([path, { componentName, position }]) => {
        return {
          type: "import",
          value: `import ${componentName} from "${path}";`,
          position,
        };
      })
      .concat(markdownAST.children);
  }

  return markdownAST;
};

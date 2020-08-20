import path from "path";

export default ({ _stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "~src": path.join(path.resolve(__dirname, "..")),
      },
    },
  });
};

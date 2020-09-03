const { NginxConfFile } = require("nginx-conf");
const { remove } = require("fs-extra");
const { resolve } = require("url");

exports.onCreatePage = ({ page, reporter, actions: { createRedirect } }) => {
  if (page.context && page.context.redirect_from) {
    page.context.redirect_from.forEach(fromPath => {
      let realFromPath = resolve(page.path, fromPath);
      reporter.verbose(`Adding redirect from ${realFromPath} to ${page.path}`);
      createRedirect({
        fromPath: realFromPath,
        toPath: page.path,
        redirectInBrowser: true,
        isPermanent: true,
      });
    });
  }
};

// based on https://github.com/gimoteco/gatsby-plugin-nginx-redirect
exports.onPostBuild = async (
  { store, reporter },
  { inputConfigFile, outputConfigFile }
) => {
  const { redirects } = store.getState();

  NginxConfFile.create(inputConfigFile, async function(err, conf) {
    if (err) {
      console.error(err);
      return;
    }

    await conf.die(inputConfigFile);
    await conf.flush();

    // this assumes a partial nginx config which lives _inside_ of a server
    // directive
    redirects.forEach(redirect => {
      let fromPath = redirect.fromPath;
      if (fromPath.slice(fromPath.length - 1) !== "/") fromPath += "/";
      conf.nginx._add(
        "rewrite",
        `^${fromPath}?$ ${redirect.toPath} ${
          redirect.isPermanent ? "permanent" : "redirect"
        }`
      );
    });

    await remove(outputConfigFile);
    await conf.live(outputConfigFile);
    await conf.write();

    reporter.info(
      `Added ${redirects.length} redirect(s) to ${outputConfigFile}`
    );
  });
};

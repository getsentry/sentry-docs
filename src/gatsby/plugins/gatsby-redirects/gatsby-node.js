const { NginxConfFile } = require("nginx-conf");
const { remove } = require("fs-extra");
const { resolve } = require("url");

exports.onCreatePage = ({ page, reporter, actions: { createRedirect } }) => {
  if (page.context && page.context.redirect_from) {
    page.context.redirect_from.forEach(fromPath => {
      let realFromPath;
      let realToPath;

      // because content gets duplicated we need to send stuff through an
      // interstitial.  This is done if a page on `/platforms/foo/` has a
      // redirect target starting with `platform:`.  Eg the page
      // `/platforms/javascript/foobar/` creates a redirect_from that is
      // named `platform:/legacy/` it will create a redirect from /legacy/
      // via the platform-redirect interstitial with `/foobar/` as next target.
      if (fromPath.match(/^platform:/)) {
        realFromPath = fromPath.replace(/^platform:/, "");
        realToPath =
          "/platform-redirect/?next=" +
          page.path.replace(/^\/platforms\/([^/]+)\//, "/");
      } else {
        realFromPath = resolve(page.path, fromPath);
        realToPath = page.path;
      }
      reporter.verbose(`Adding redirect from ${realFromPath} to ${realToPath}`);

      createRedirect({
        fromPath: realFromPath,
        toPath: realToPath,
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

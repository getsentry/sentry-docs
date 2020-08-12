const { NginxConfFile } = require("nginx-conf");
const { remove } = require("fs-extra");

exports.createPages = async ({ graphql, actions: { createRedirect } }) => {
  console.info(`Generating redirects from frontmatter`);

  const results = await graphql(
    `
      {
        allFile {
          edges {
            node {
              childMdx {
                fields {
                  slug
                }
                frontmatter {
                  redirect_from
                }
              }
              childMarkdownRemark {
                fields {
                  slug
                }
                frontmatter {
                  redirect_from
                }
              }
            }
          }
        }
      }
    `
  );

  results.data.allFile.edges.forEach(({ node }) => {
    const child = node.childMdx || node.childMarkdownRemark;
    if (!child) return;
    const {
      fields: { slug },
      frontmatter: { redirect_from },
    } = child;

    if (redirect_from) {
      redirect_from.forEach(fromPath => {
        createRedirect({
          fromPath,
          toPath: slug,
          redirectInBrowser: true,
          isPermanent: true,
        });
      });
    }
  });
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
      console.debug(`Adding redirect from ${fromPath} to ${redirect.toPath}`);
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

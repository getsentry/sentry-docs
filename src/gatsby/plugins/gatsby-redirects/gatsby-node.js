/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

const {resolve} = require('url');

exports.onCreatePage = ({page, reporter, actions: {createRedirect}}) => {
  if (page.context && page.context.redirect_from) {
    page.context.redirect_from.forEach(fromPath => {
      const realFromPath = resolve(page.path, fromPath);
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

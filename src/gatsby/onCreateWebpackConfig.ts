/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import path from 'path';

import SentryWebpackPlugin from '@sentry/webpack-plugin';

const getPlugins = reporter => {
  const authToken = process.env.SENTRY_AUTH_TOKEN;
  if (!authToken) {
    reporter.warn('SENTRY_AUTH_TOKEN is not set - will not upload source maps');
    return [];
  }
  return [
    new SentryWebpackPlugin({
      org: 'sentry',
      project: 'docs',
      authToken,
      include: ['public'],
      stripPrefix: ['public/'],
      dryRun: process.env.NODE_ENV !== 'production',
    }),
  ];
};

function main({actions, reporter}) {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '~src': path.join(path.resolve(__dirname, '..')),
      },
    },
    plugins: getPlugins(reporter),
  });
}

export default main;

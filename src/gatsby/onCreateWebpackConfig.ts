/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import path from 'path';

import {sentryWebpackPlugin} from '@sentry/webpack-plugin';
import {GatsbyNode} from 'gatsby';

const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
      alias: {
        'sentry-docs': path.join(path.resolve(__dirname, '..')),
      },
    },
    plugins: [
      sentryWebpackPlugin({
        org: 'sentry',
        project: 'docs',
        authToken: process.env.SENTRY_WEBPACK_PLUGIN_AUTH_TOKEN,
        sourcemaps: {assets: './public/**'},
      }),
    ],
  });
};

export default onCreateWebpackConfig;

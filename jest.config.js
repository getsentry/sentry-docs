/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

// https://www.gatsbyjs.com/docs/unit-testing/
module.exports = {
  transform: {
    '^.+\\.(js|ts)x?$': `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    '^sentry-docs/(.*)': '<rootDir>/src/$1',
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
    '^gatsby-page-utils/(.*)$': `gatsby-page-utils/dist/$1`, // Workaround for https://github.com/facebook/jest/issues/9771
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testEnvironmentOptions: {
    url: `http://localhost`,
  },
  setupFilesAfterEnv: ['<rootDir>/setup-test-env.js'],
};

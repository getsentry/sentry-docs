// https://www.gatsbyjs.com/docs/unit-testing/
module.exports = {
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  setupFilesAfterEnv: ["<rootDir>/setup-test-env.js"],
  transform: {
    "^.+\\.[jt]sx?$": `<rootDir>/jest-transformer.js`,
  },
  testEnvironment: `jest-environment-jsdom-fourteen`,
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
};

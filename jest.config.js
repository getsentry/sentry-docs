// https://www.gatsbyjs.com/docs/unit-testing/
module.exports = {
  preset: "jest-preset-gatsby/typescript",
  setupFilesAfterEnv: ["<rootDir>/setup-test-env.js"],
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
};

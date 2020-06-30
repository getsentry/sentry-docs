module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": `<rootDir>/jest-transformer.js`,
  },
  testEnvironment: `jest-environment-jsdom-fourteen`,
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
};

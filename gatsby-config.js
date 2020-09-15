require("ts-node").register({
  files: true, // to that TS node hooks have access to local typings too
});

const activeEnv =
  process.env.GATSBY_ENV || process.env.NODE_ENV || "development";

console.log(`Using environment config: '${activeEnv}'`);

require("dotenv").config({
  path: `.env.${activeEnv}`,
});

if (
  process.env.VERCEL_GITHUB_COMMIT_REF === "master" &&
  process.env.ALGOLIA_ADMIN_KEY
) {
  process.env.ALGOLIA_INDEX = "1";
}

module.exports = require("./src/gatsby/config");

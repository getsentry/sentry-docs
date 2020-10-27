import axios from "axios";
import { promises as fs } from "fs";

// SENTRY_API_SCHEMA_SHA is used in the bump-openapi GHA workflow.
// DO NOT change variable name unless you change it in the bump-openapi GHA workflow.
const SENTRY_API_SCHEMA_SHA = a0e1a4e1a14f84631582c4769a4ebe8f6eab416b

const activeEnv =
  process.env.GATSBY_ENV || process.env.NODE_ENV || "development";

export default async () => {
  if (activeEnv === "development" && process.env.OPENAPI_LOCAL_PATH) {
    try {
      console.log(`Fetching from ${process.env.OPENAPI_LOCAL_PATH}`);
      let data = await fs.readFile(process.env.OPENAPI_LOCAL_PATH, "utf8");
      return data;
    } catch (error) {
      console.log(
        `Failed to connect to  ${process.env.OPENAPI_LOCAL_PATH}. Continuing to fetch versioned schema from Github.
        ${error}`
      );
    }
  }
  const response = await axios.get(
    `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`
  );
  return response.data;
};

import axios from "axios";
import { promises as fs } from "fs";

// SENTRY_API_SCHEMA_SHA is used in the sentry-docs GHA workflow in getsentry/sentry-api-schema.
// DO NOT change variable name unless you change it in the sentry-docs GHA workflow in getsentry/sentry-api-schema.
const SENTRY_API_SCHEMA_SHA = "d1f1df803df3c207bf267dd8fcb3e76226f53291"

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

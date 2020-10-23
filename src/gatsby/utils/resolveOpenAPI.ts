import axios from "axios";
import { promises as fs } from "fs";

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
    "https://raw.githubusercontent.com/getsentry/sentry-api-schema/20c924b1bb3ead4c76b540c075f59733590c0c3a/openapi-derefed.json"
  );
  return response.data;
};

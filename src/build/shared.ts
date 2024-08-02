import {DeRefedOpenAPI} from './open-api/types';

export const BASE_REGISTRY_URL = 'https://release-registry.services.sentry.io';
const SENTRY_API_SCHEMA_SHA = '6851c7f94c9b09cfec8d357c5bab0ce4bb597ee8';

export const resolveRemoteApiSpec = async (): Promise<DeRefedOpenAPI> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`
  );
  return response.json() as Promise<DeRefedOpenAPI>;
};

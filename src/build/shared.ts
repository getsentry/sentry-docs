import {DeRefedOpenAPI} from './open-api/types';

export const BASE_REGISTRY_URL = 'https://release-registry.services.sentry.io';
const SENTRY_API_SCHEMA_SHA = 'aee3c08319966d0f5381ce7d083cd81e4fdb00f9';

export const resolveRemoteApiSpec = async (): Promise<DeRefedOpenAPI> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`
  );
  return response.json() as Promise<DeRefedOpenAPI>;
};

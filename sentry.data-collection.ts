import type * as Sentry from '@sentry/nextjs';

type DataCollection = NonNullable<
  NonNullable<Parameters<typeof Sentry.init>[0]>['dataCollection']
>;

const SENSITIVE_KEYS = ['forwarded', '-ip', 'remote-', 'via', '-user'];

/**
 * Matches the v10 `sendDefaultPii: false` baseline.
 *
 * v11 replaced `sendDefaultPii` with `dataCollection`, whose defaults collect
 * user info, cookies, headers and request/response bodies. Each category is set
 * explicitly here so the client, server and edge runtimes stay aligned.
 */
export const dataCollection: DataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: {
    request: {deny: SENSITIVE_KEYS},
    response: {deny: SENSITIVE_KEYS},
  },
  httpBodies: [],
  urlQueryParams: {deny: SENSITIVE_KEYS},
  graphQL: {document: false, variables: false},
  genAI: {inputs: false, outputs: false},
  databaseQueryData: false,
};

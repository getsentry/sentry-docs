import {isDeveloperDocs} from 'sentry-docs/docsSite.mjs';

export function relativizeUrl(url: string) {
  return isDeveloperDocs
    ? url
    : url.replace(/^(https?:\/\/docs\.sentry\.io)(?=\/|$)/, '');
}

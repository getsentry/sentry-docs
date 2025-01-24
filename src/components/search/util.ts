import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

export function relativizeUrl(url: string) {
  return isDeveloperDocs
    ? url
    : url.replace(/^(https?:\/\/docs\.sentry\.io)(?=\/|$)/, '');
}

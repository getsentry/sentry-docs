import {isDeveloperDocs} from './isDeveloperDocs';

export const getChangelogLink = () =>
  isDeveloperDocs ? 'https://docs.sentry.io/changelog' : '/changelog';

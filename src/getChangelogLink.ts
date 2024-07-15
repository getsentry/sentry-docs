import {isDeveloperDocs} from './isDeveloperDocs';

// changelog app is only available on user-facing docs
export const getChangelogLink = () =>
  isDeveloperDocs ? 'https://docs.sentry.io/changelog' : '/changelog';

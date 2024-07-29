import {isDeveloperDocs} from './isDeveloperDocs';

// changelog app is only available on user-facing docs
export const getChangelogLink = () =>
  isDeveloperDocs ? 'https://sentry.io/changelog/' : '/changelog';

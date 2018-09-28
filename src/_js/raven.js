import Raven from 'raven-js';
const dsn = 'https://ad63ba38287245f2803dc220be959636@sentry.io/1267915';
Raven.config(dsn).install();

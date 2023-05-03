---
name: Google Cloud Functions (Node)
doc_link: https://docs.sentry.io/platforms/node/guides/gcp-functions/
support_level: production
type: framework
---

Add `@sentry/serverless` as a dependency to `package.json`:

```javascript
dependencies: {
  //...
  "@sentry/serverless": "^7"
}
```

To set up Sentry for a Google Cloud Function:

### Http Functions

```javascript
const Sentry = require('@sentry/serverless');

Sentry.GCPFunction.init({
  dsn: '___PUBLIC_DSN___',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

exports.helloHttp = Sentry.GCPFunction.wrapHttpFunction((req, res) => {
  throw new Error('oh, hello there!');
});
```

### Background Functions

```javascript
const Sentry = require('@sentry/serverless');

Sentry.GCPFunction.init({
  dsn: '___PUBLIC_DSN___',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

exports.helloEvents = Sentry.GCPFunction.wrapEventFunction((data, context, callback) => {
  throw new Error('oh, hello there!');
});
```

### CloudEvent Functions

```javascript
const Sentry = require('@sentry/serverless');

Sentry.GCPFunction.init({
  dsn: '___PUBLIC_DSN___',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

exports.helloEvents = Sentry.GCPFunction.wrapCloudEventFunction((context, callback) => {
  throw new Error('oh, hello there!');
});
```

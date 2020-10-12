---
name: GCP Cloud Functions (Node)
doc_link: https://docs.sentry.io/platforms/node/guides/gcp-functions/
support_level: production
type: framework
---

Add `@sentry/node` as a dependency:

```bash {tabTitle:npm}
npm install --save @sentry/serverless
```

```bash {tabTitle:Yarn}
yarn add @sentry/serverless
```

To set up Sentry for a GCP Cloud Function:

```javascript {tabTitle:http functions}
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1.0,
});

exports.helloHttp = Sentry.GCPFunction.wrapHttpFunction((req, res) => {
  throw new Error('oh, hello there!');
});
```

```javascript {tabTitle:background functions}
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1.0,
});

exports.helloEvents = Sentry.GCPFunction.wrapEventFunction((data, context, callback) => {
  throw new Error('oh, hello there!');
});
```

```javascript {tabTitle:cloudEvents}
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1.0,
});

exports.helloEvents = Sentry.GCPFunction.wrapCloudEventFunction((context, callback) => {
  throw new Error('oh, hello there!');
});

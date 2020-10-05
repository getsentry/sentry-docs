---
name: GCP Cloud Functions (Node)
doc_link: https://docs.sentry.io/platforms/node/guides/gcp-functions/
support_level: production
type: framework
---

Add `@sentry/node` as a dependency:

```bash {tabTitle:npm}
npm install --save @sentry/node
```

```bash {tabTitle:Yarn}
yarn add @sentry/node
```

To set up Sentry error logging for a GCP Cloud Function:

```javascript
"use strict";

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
});

try {
  notExistFunction();
} catch (e) {
  Sentry.captureException(e);
  Sentry.flush(2000);
}

exports.cloud_handler = (event, context) => {
  return {
    status_code: "200",
    body: "Hello from GCP Cloud Function!",
  };
};
```

Note: You need to call both `captureException` and `flush` for captured events to be successfully delivered to Sentry.

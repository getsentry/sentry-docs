---
name: Azure Functions (Node)
doc_link: https://docs.sentry.io/platforms/node/guides/azure-functions/
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

To set up Sentry error logging for an Azure Function:

```javascript
"use strict";

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
});

module.exports = async function(context, req) {
  try {
    await notExistFunction();
  } catch (e) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
  }

  context.res = {
    status: 200,
    body: "Hello from Azure Cloud Function!",
  };
};
```

Note: You need to call both `captureException` and `flush` for captured events to be successfully delivered to Sentry.

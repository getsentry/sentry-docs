---
name: Node.js
doc_link: https://docs.sentry.io/platforms/node/
support_level: production
type: language
---

Add `@sentry/node` as a dependency:

```bash
# Using yarn
$ yarn add @sentry/node @sentry/tracing

# Using npm
$ npm install --save @sentry/node @sentry/tracing
```

You need to inform the Sentry Node SDK about your DSN:

```javascript
const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "___PUBLIC_DSN___",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change tracesSampleRate to a value between 0 and 1.

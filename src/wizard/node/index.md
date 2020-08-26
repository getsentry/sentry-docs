---
name: Node.js
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=node
support_level: production
type: language
---

If you are using `yarn` or `npm` you can add our package as a dependency:

```bash
# Using yarn
$ yarn add @sentry/node

# Using npm
$ npm install @sentry/node
```

You need to inform the Sentry Node SDK about your DSN:

```javascript
const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

Sentry.init({ dsn: "___PUBLIC_DSN___" });
```

One way to verify your setup is by intentionally sending an event that breaks your application.

Calling an undefined function will throw an exception:

```js
myUndefinedFunction();
```

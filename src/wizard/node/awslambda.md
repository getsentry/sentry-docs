---
name: AWS Lambda
doc_link: https://docs.sentry.io/platforms/node/guides/aws-lambda/
support_level: production
type: framework
---
Create a deployment package on your local machine and install the required dependencies in the deployment package. For more information, see [Building an AWS Lambda deployment package for Node.js](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/).

Add `@sentry/node` as a dependency:

```bash {tabTitle:npm}
$ npm install --save @sentry/node
```

```bash {tabTitle:Yarn}
$ yarn add @sentry/node
```

To set up Sentry error logging for a Lambda Function, build a wrapper:

```javascript
"use strict";

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
});

function sentryHandler(lambdaHandler) {
  return async event => {
    try {
      return await lambdaHandler(event);
    } catch (e) {
      Sentry.captureException(e);
      await Sentry.flush(2000);
      return e;
    }
  };
}

module.exports.hello = sentryHandler(async event => {
  notExistFunction();
  return event;
});
```

Note: You need to call both `captureException` and `flush` for captured events to be successfully delivered to Sentry.

---
name: AWS Lambda (Node)
doc_link: https://docs.sentry.io/platforms/node/guides/aws-lambda/
support_level: production
type: framework
---

Create a deployment package on your local machine and install the required dependencies in the deployment package. For more information, see [Building an AWS Lambda deployment package for Node.js](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/).

Add `@sentry/serverless` as a dependency:

```bash {tabTitle:npm}
npm install --save @sentry/serverless
```

```bash {tabTitle:Yarn}
yarn add @sentry/serverless
```

You can use the AWS Lambda integration for the Node like this:

```javascript {tabTitle:async}
const Sentry = require("@sentry/serverless");

Sentry.AWSLambda.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1.0,
});

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
  // Your handler code
});
```

```javascript {tabTitle:sync}
const Sentry = require("@sentry/serverless");

Sentry.AWSLambda.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1.0,
});

exports.handler = Sentry.AWSLambda.wrapHandler((event, context, callback) => {
  // Your handler code
});
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->

## Enable Timeout Warning

Sentry reports timeout warning when the function is within 500ms of it's execution time. You can turn off timeout warnings by setting `captureTimeoutWarning` to `false` in the handler options. To change timeout warning limit, assign a numeric value (in ms) to `timeoutWarningLimit`

```javascript {tabTitle:captureTimeoutWarning}
exports.handler = Sentry.AWSLambda.wrapHandler(yourHandler, {
  captureTimeoutWarning: false,
});
```

```javascript {tabTitle:timeoutWarning}
exports.handler = Sentry.AWSLambda.wrapHandler(yourHandler, {
  timeoutWarningLimit: 50,
});
```

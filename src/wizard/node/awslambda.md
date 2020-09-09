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

You can use the AWS Lambda integration for the Node SDK like this:

```javascript
const Sentry = require("@sentry/serverless");

Sentry.init({
  dsn:
    "___PUBLIC_DSN___",
});

const myAsyncHandler = async (event, context, callback) => {
  //Your handler code
};

exports.handler = Sentry.AWSLambda.wrapHandler(myAsyncHandler);
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->

## Timeout Warning

Sentry reports timeout warning when the function is within 500ms of it's execution time. You can turn off timeout warnings by setting `captureTimeoutWarning` to `false` during initiatlization. To change timeout warning limit, assign a numeric value (in ms) to `timeoutWarning`.

```javascript {tabTitle:captumeTimeoutWarning}
Sentry.init({
  dsn:
    "___PUBLIC_DSN___",
    captureTimeoutWarning: false
});
```

```javascript {tabTitle:timeoutWarning}
Sentry.init({
  dsn:
    "___PUBLIC_DSN___",
    timeoutWarning: 50
});
```

The timeout warning is sent only if the "timeout" in the Lambda Function configuration is set to a value greater than one second.

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
*Update Sample Code*
const http = require("http");
const Sentry = require("@sentry/node");
const { AWSLambdaIntegration } = require("@sentry/integrations");

// Configure the Sentry SDK.
Sentry.init({
  dsn:
    "___PUBLIC_DSN___",
  integrations: [AWSLambdaIntegration],
});

exports.handler = (event, context) => {
  AWSLambdaIntegration.providedContext(context);
  throw new Error("this is a dummy error")
};
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->

## Enable Timeout Warning

Timeout warning indicates high probability of the function timing out. Update the sentry initialization to set `timeoutWarning` to `true`

```javascript
Sentry.init({
  dsn:
    "___PUBLIC_DSN___",
  integrations: [AWSLambdaIntegration(true)],
});
```

The timeout warning is sent only if the "timeout" in the Lambda Function configuration is set to a value greater than one second.

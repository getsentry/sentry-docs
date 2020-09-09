---
name: AWS Lambda
doc_link: https://docs.sentry.io/platforms/node/guides/aws-lambda/
support_level: production
type: framework
---

Create a deployment package on your local machine and install the required dependencies in the deployment package. For more information, see [Building an AWS Lambda deployment package for Node.js](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/).

Add `@sentry/serverless` as a dependency:

```bash {tabTitle:npm}
$ npm install --save @sentry/serverless
```

```bash {tabTitle:Yarn}
$ yarn add @sentry/serverless
```

You can use the AWS Lambda integration for the Node like this:
```javascript
const Sentry = require("@sentry/serverless");
Sentry.init({
  dsn: "___PUBLIC_DSN___"
});
const yourHandler = (event, context, callback) => {
  // Your handler code
};
exports.handler = Sentry.AWSLambda.wrapHandler(yourHandler);
```

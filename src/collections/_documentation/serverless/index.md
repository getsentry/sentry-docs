---
title: 'Serverless'
sidebar_order: 0
---

Sentry for Serverless captures error events along by using an SDK within your application’s runtime (as opposed to logs to filter error events). These are platform specific and allow Sentry to have a deep understanding of how your application behavior including the ability to add additional context during runtime and applying pin filters.

You can use following integrations to automatically or manually report errors into Sentry:

* AWS Lambda
    * [Python]({% link _documentation/platforms/python/aws_lambda.md %})
    * [Node]({% link _documentation/platforms/node/aws_lambda.md %})
* Other Serverless Providers
    * [Python Generic Decorator]({% link _documentation/platforms/python/generic.md %})
    * [Go]({% link _documentation/platforms/go/serverless.md %})

## Additional Data Reporting

While Sentry already captures useful context for serverless functions through the SDKs, you can send arbitrary key/value pairs of data which the SDK will store alongside the event. These are not indexed and the Sentry SDK uses them to add additional information about what might be happening.

```basic
scope.set_extra(“lambda_function_name”, “sample_lambda_function”)
```

---
title: 'Serverless'
sidebar_order: 0
---

Sentry for Serverless captures error events using platform specific SDKs within your application’s runtime (as opposed to using logs to parse error events). The SDKs allow Sentry to have a deep understanding of your application behavior including the ability to add additional context during runtime and reducing noise.

You can use following integrations to automatically or manually report errors into Sentry:

* AWS Lambda
    * [Python](/platforms/python/)
    * [Node](/platforms/node/)
* GCP Functions
    * [Python](/platforms/python/)
    * [Node](/platforms/node/)
* Other Serverless Providers
    * [Python Serverless Decorator](/platforms/python/)
    * [Go](/platforms/go/)

## Additional Data Reporting

While Sentry already captures useful context for serverless functions through the SDKs, you can send arbitrary key/value pairs of data which the SDK will store alongside the event. These are not indexed and the Sentry SDK uses them to add additional information about what might be happening.

```basic
scope.set_extra(“lambda_function_name”, “sample_lambda_function”)
```

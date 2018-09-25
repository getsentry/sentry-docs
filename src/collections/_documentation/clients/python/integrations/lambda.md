---
title: 'Amazon Web Services Lambda'
---

## Installation

To use [Sentry](https://getsentry.com/) with [AWS Lambda](https://aws.amazon.com/lambda), you have to install _raven_ as an external dependency. This involves creating a [Deployment package](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python-how-to-create-deployment-package.html) and uploading it to AWS.

To install raven into your current project directory:

```console
pip install raven -t /path/to/project-dir
```

## Setup

Create a _LambdaClient_ instance and wrap your lambda handler with the _capture_exeptions_ decorator:

```python
from raven.contrib.awslambda import LambdaClient

client = LambdaClient()

@client.capture_exceptions
def handler(event, context):
    ...
    raise Exception('I will be sent to sentry!')
```

By default this will report unhandled exceptions and errors to Sentry.

The `LambdaClient` accepts the same arguments as the regular `Client`, see [_Configuring the Client_]({%- link _documentation/clients/python/advanced.md -%}#python-client-config).

The integration was inspired by [raven python lambda](https://github.com/Netflix-Skunkworks/raven-python-lambda), another implementation that also integrates with Serverless Framework and has SQS transport support.

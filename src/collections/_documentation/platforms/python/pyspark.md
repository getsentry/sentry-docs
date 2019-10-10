---
title: Apache Spark
sidebar_order: 9
---

{% version_added INSERT_VERSION_HERE %}

<!-- WIZARD -->
The Spark Integration adds support for the Python API for Apache Spark, [PySpark](https://spark.apache.org/)

### Driver

The spark driver integration is supported for Spark 2 and above.

To configure the SDK, initialize it with the integration before you create a `SparkContext` or `SparkSession`.

```python
import sentry_sdk
from sentry_sdk.integrations.spark import SparkIntegration

if __name__ == "__main__":
    sentry_sdk.init("___PUBLIC_DSN___", integrations=[SparkIntegration()])

    spark = SparkSession\
        .builder\
        .appName("ExampleApp")\
        .getOrCreate()
    ...
```

### Worker

The spark worker integration is supported for Spark 2.4.0 and above.

Create a file called `sentry-daemon.py` with the following content:

```python
import sentry_sdk
from sentry_sdk.integrations.spark import SparkWorkerIntegration
import pyspark.daemon as original_daemon

if __name__ == '__main__':
    sentry_sdk.init("___PUBLIC_DSN___", integrations=[SparkWorkerIntegration()])
    original_daemon.manager()
```

In your `spark_submit` command, add the following configuration options so the spark clusters can use the sentry integration.

```bash
./bin/spark-submit \
    --py-files sentry_daemon.py \
    --conf spark.python.use.daemon=true \
    --conf spark.python.daemon.module=sentry_daemon \
    example-spark-job.py
```

<!-- ENDWIZARD -->

## Behaviour

* You must have the sentry python sdk installed on all your clusters to use the Spark integration. The easiest way to do this is to run an initialization script on all your clusters:

```bash
pip install --upgrade 'sentry-sdk=={% sdk_version sentry.python %}'
```
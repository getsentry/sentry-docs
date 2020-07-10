---
title: Apache Airflow
sidebar_order: 9
---

[Apache Airflow](https://airflow.apache.org/) **1.10.6** and above can be setup to send errors to Sentry.

## Installation

Install the `apache-airflow` package with the `sentry` requirement.

```py
pip install 'apache-airflow[sentry]'
```

You can then add your Sentry DSN to your configuration file (ex. `airflow.cfg`) under the `[sentry]` field.

```ini
[sentry]
sentry_dsn = ___PUBLIC_DSN___
```

Now, Airflow should report errors to Sentry automatically. Airflow will also generate custom tags and breadcrumbs based on the current dag and tasks at time of error.

Please see the official [Apache Airflow documentation](https://airflow.apache.org/docs/stable/errors.html) for more details.

### Configuration

Please see the official [Apache Airflow documentation](https://airflow.apache.org/docs/stable/configurations-ref.html#sentry) for the full list of configuration options available.

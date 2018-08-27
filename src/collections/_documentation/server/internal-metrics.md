---
title: 'Internal Metrics'
sidebar_order: 2
---

Sentry provides an abstraction called ‘metrics’ which is used for internal monitoring, generally timings and various counters.

The default backend simply discards them (though some values are still kept in the internal time series database).

## Statsd Backend

```python
SENTRY_METRICS_BACKEND = 'sentry.metrics.statsd.StatsdMetricsBackend'
SENTRY_METRICS_OPTIONS = {
    'host': 'localhost',
    'port': 8125,
}
```

## Datadog Backend

{% version_added 8.0.0. %}

Datadog will require you to install the `datadog` package into your Sentry environment:

```bash
$ pip install datadog
```

```python
SENTRY_METRICS_BACKEND = 'sentry.metrics.datadog.DatadogMetricsBackend'
SENTRY_METRICS_OPTIONS = {
    'api_key': '...',
    'app_key': '...',
    'tags': {},
}
```

Once installed, the Sentry metrics will be emitted to the [Datadog REST API](https://docs.datadoghq.com/api/?lang=python#post-time-series-points) over HTTPS.

## DogStatsD Backend

{% version_added 8.16.0. %}

Using the DogStatsD backend requires a [Datadog Agent](https://docs.datadoghq.com/agent/) to be running with the DogStatsD backend (on by default at port 8125).

You must also install the `datadog` Python package into your Sentry environment:

```bash
$ pip install datadog
```

```python
SENTRY_METRICS_BACKEND = 'sentry.metrics.datadog.DogStatsdMetricsBackend'
SENTRY_METRICS_OPTIONS = {
    'host': 'localhost',
    'port': 8125,
    'tags': {},
}
```

Once configured, the metrics backend will emit to the DogStatsD server and then flushed periodically to Datadog over HTTPS.

## Logging Backend

The `LoggingBackend` reports all operations to the `sentry.metrics` logger. In addition to the metric name and value, log messages also include extra data such as the `instance` and `tags` values which can be displayed using a custom formatter.

```python
SENTRY_METRICS_BACKEND = 'sentry.metrics.logging.LoggingBackend'

LOGGING['loggers']['sentry.metrics'] = {
    'level': 'DEBUG',
    'handlers': ['console:metrics'],
    'propagate': False,
}

LOGGING['formatters']['metrics'] = {
    'format': '[%(levelname)s] %(message)s; instance=%(instance)r; tags=%(tags)r',
}

LOGGING['handlers']['console:metrics'] = {
    'level': 'DEBUG',
    'class': 'logging.StreamHandler',
    'formatter': 'metrics',
}
```

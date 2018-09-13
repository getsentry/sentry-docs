---
title: RQ
sidebar_order: 12
---

Starting with RQ version 0.3.1, support for Sentry has been built in.

<!-- WIZARD -->
## Usage

RQ natively supports binding with Sentry by passing your `SENTRY_DSN` through `rqworker`:

```bash
$ rqworker --sentry-dsn="___DSN___"
```

## Extended Setup

If you want to pass additional information, such as `release`, you’ll need to bind your own instance of the Sentry `Client`:

```python
from raven import Client
from raven.transport.http import HTTPTransport
from rq.contrib.sentry import register_sentry

client = Client('___DSN___', transport=HTTPTransport)
register_sentry(client, worker)
```

Please see `rq`‘s documentation for more information: [http://python-rq.org/patterns/sentry/](http://python-rq.org/patterns/sentry/)
<!-- ENDWIZARD -->

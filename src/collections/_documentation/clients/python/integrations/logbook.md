---
title: Logbook
sidebar_order: 8
---

## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```

## Setup

Raven provides a [logbook](http://logbook.pocoo.org) handler which will pipe messages to Sentry.

First you’ll need to configure a handler:

```python
from raven.handlers.logbook import SentryHandler

# Manually specify a client
client = Client(...)
handler = SentryHandler(client)
```

You can also automatically configure the default client with a DSN:

```python
# Configure the default client
handler = SentryHandler('___DSN___')
```

Finally, bind your handler to your context:

```python
from raven.handlers.logbook import SentryHandler

client = Client(...)
sentry_handler = SentryHandler(client)
with sentry_handler.applicationbound():
    # everything logged here will go to sentry.
    ...
```

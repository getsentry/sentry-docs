---
title: Bottle
sidebar_order: 4
---

[Bottle](http://bottlepy.org/) is a microframework for Python. Raven supports this framework through the WSGI integration.

## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```

## Setup

The first thing you’ll need to do is to disable catchall in your Bottle app:

```python
import bottle

app = bottle.app()
app.catchall = False
```

{% capture __alert_content -%}
Bottle will not propagate exceptions to the underlying WSGI middleware by default. Setting catchall to False disables that.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Sentry will then act as Middleware:

```python
from raven import Client
from raven.contrib.bottle import Sentry
client = Client('___DSN___')
app = Sentry(app, client)
```

## Usage

Once you’ve configured the Sentry application you need only call run with it:

```python
run(app=app)
```

If you want to send additional events, a couple of shortcuts are provided on the Bottle request app object.

Capture an arbitrary exception by calling `captureException`:

```python
try:
    1 / 0
except ZeroDivisionError:
    request.app.sentry.captureException()
```

Log a generic message with `captureMessage`:

```python
request.app.sentry.captureMessage('Hello, world!')
```

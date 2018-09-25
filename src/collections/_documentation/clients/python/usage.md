---
title: 'Basic Usage'
---

This gives a basic overview of how to use the raven client with Python directly.

<!-- WIZARD -->
## Capture an Error

The most basic use for raven is to record one specific error that occurs:

```python
from raven import Client

client = Client('___DSN___')

try:
    1 / 0
except ZeroDivisionError:
    client.captureException()
```

## Reporting an Event

To report an arbitrary event you can use the [`capture()`]({%- link _documentation/clients/python/api.md -%}#raven.Client.capture "raven.Client.capture") method. This is the most low-level method available. In most cases you would want to use the [`captureMessage()`]({%- link _documentation/clients/python/api.md -%}#raven.Client.captureMessage "raven.Client.captureMessage") method instead however which directly reports a message:

```python
client.captureMessage('Something went fundamentally wrong')
```
<!-- ENDWIZARD -->

## Adding Context

The raven client internally keeps a thread local mapping that can carry additional information. Whenever a message is submitted to Sentry that additional data will be passed along.

For instance if you use a web framework, you can use this to inject additional information into the context. The basic primitive for this is the [`context`]({%- link _documentation/clients/python/api.md -%}#raven.Client.context "raven.Client.context") attribute. It provides a _merge()_ and _clear()_ function that can be used:

```python
def handle_request(request):
    client.context.merge({'user': {
        'email': request.user.email
    }})
    try:
        ...
    finally:
        client.context.clear()
```

Additionally starting with Raven 5.14 you can bind the context to the current thread to enable crumb support by calling _activate()_. The deactivation happens upon calling _clear()_. This can also be achieved by using the context object with the _with_ statement. This is needed to enable breadcrumb capturing. Framework integrations typically do this automatically.

These two examples are equivalent:

```python
def handle_request(request):
    client.context.activate()
    client.context.merge({'user': {
        'email': request.user.email
    }})
    try:
        ...
    finally:
        client.context.clear()
```

With a context manager:

```python
def handle_request(request):
    with client.context:
        client.context.merge({'user': {
            'email': request.user.email
        }})
        try:
            ...
        finally:
            client.context.clear()
```

## Testing the Client

Once you’ve got your server configured, you can test the Raven client by using its CLI:

```bash
raven test ___DSN___
```

If you’ve configured your environment to have `SENTRY_DSN` available, you can simply drop the optional DSN argument:

```bash
raven test
```

You should get something like the following, assuming you’re configured everything correctly:

```bash
$ raven test sync+___DSN___
Using DSN configuration:
  sync+___DSN___

Client configuration:
  servers        : ___API_URL___/api/store/
  project        : ___PROJECT_ID___
  public_key     : ___PUBLIC_KEY___
  secret_key     : ___SECRET_KEY___

Sending a test message... success!
```

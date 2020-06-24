---
title: Migrating from Raven to Sentry-Python
sidebar_order: 1
---

If you want to move to the new sentry-python SDK we provided a short guide here of the most common patterns:

## Installation

The installation is now the same regardless of framework or library you integrate with. There are no alternative initialization routines other than `sentry_sdk.init`. For integration-specific instructions please refer to [our list of integrations for the new SDK](/platforms/python/#integrations).

**Old**:

```python
import raven
client = raven.Client('___PUBLIC_DSN___', release="1.3.0")
```

**New**:

```python
import sentry_sdk
sentry_sdk.init('___PUBLIC_DSN___', release='1.3.0')
```

## Set a global tag

**Old**:

```python
client.tags_context({'key': 'value'})
```

**New**:

```python
sentry_sdk.set_tag('key', 'value')
```

## Capture custom exception

**Old**:

```python
try:
    throwing_function()
except Exception:
    client.captureException(extra={'debug': False})
```

**New**:

```python
with sentry_sdk.push_scope() as scope:
    scope.set_extra('debug', False)

    try:
        throwing_function()
    except Exception as e:
        sentry_sdk.capture_exception(e)
```

## Capture a message

**Old**:

```python
client.captureMessage('test', level='info', extra={'debug': False})
```

**New**:

```python
with sentry_sdk.push_scope() as scope:
    scope.set_extra('debug', False)
    sentry_sdk.capture_message('test', 'info')
```

## Breadcrumbs

**Old**:

```python
from raven import breadcrumbs import

breadcrumbs.record(
    message='Item added to shopping cart',
    category='action',
    data={
        'isbn': '978-1617290541',
        'cartSize': '3'
    }
)
```

**New**:

```python
sentry_sdk.add_breadcrumb(
  message='Item added to shopping cart',
  category='action',
  data={
    'isbn': '978-1617290541',
    'cartSize': '3'
  }
)
```

## Filtering sensitive data

Raven used to have a few built-in heuristics to detect password fields and
creditcard numbers. Since those heuristics were the same for everybody, it was
impossible to further improve them for a usecase without breaking somebody
else's usecase. There is no easy search-and-replace type solution in the new
SDK.

We encourage you to consider alternative options outlined at [_Filtering Events_](/error-reporting/configuration/filtering/).

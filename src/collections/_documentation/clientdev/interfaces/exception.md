---
title: 'Exception Interface'
---

An exception consists of a list of values. In most cases, this list contains a single exception, with an optional stacktrace interface. Multiple values represent a chained exception, and should be sent oldest to newest. That is, if your code does this:

```python
try:
    raise Exception
except Exception as e:
    raise ValueError() from e
```

The order of exceptions would be `Exception` and then `ValueError`.

Attributes:

`type`:

: the type of exception, e.g. `ValueError`

`value`:

: the value of the exception (a string)

`module`:

: the optional module, or package which the exception type lives in

`thread_id`:

: an optional value which refers to a thread in the [_threads_]({%- link _documentation/clientdev/interfaces/threads.md -%}) interface.

`mechanism`:

: an optional object describing the [_mechanism_]({%- link _documentation/clientdev/interfaces/mechanism.md -%}) that created this exception.

You can also optionally bind a [_stacktrace interface_]({%- link _documentation/clientdev/interfaces/stacktrace.md -%}) to an exception.

```json
"exception": {
  "values": [{
    "type": "ValueError",
    "value": "My exception value",
    "module": "__builtins__",
    "stacktrace": {sentry.interfaces.Stacktrace}
  }]
}
```

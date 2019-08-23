---
title: Message Interface
sidebar_order: 3
---

The Message Interface carries a log message that describes an event or error.
Optionally, it can carry a format string and structured parameters. This can
help to group similar messages into the same issue.

## Attributes

`formatted`:

: **Required**. The fully formatted message. If missing, Sentry will try to
  interpolate the message.
  
  It must not exceed 8192 characters. Longer messages will be truncated.

`message`:

: _Optional_. The raw message string (uninterpolated).

  It must not exceed 8192 characters. Longer messages will be truncated.

`params`:

: _Optional_: A list of formatting parameters, preferably strings. Non-strings
  will be coerced to strings.


## Examples

```json
{
  "message": {
    "message": "My raw message with interpreted strings like %s",
    "params": ["this"]
  }
}
```

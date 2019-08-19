---
title: Message Interface
sidebar_order: 3
---

The Log Entry Interface is a slightly improved version of the `message`
attribute and can be used to split the log message from the log message
parameters:

A standard message, generally associated with parameterized logging.

## Attributes

`message`:

: The raw message string (uninterpolated).

  It must not exceed 8192 characters. Longer messages will be truncated.

`params`:

: An optional list of formatting parameters.

`formatted`:

: _Optional_. The fully formatted message. If missing, Sentry will try to
  interpolate the message.

## Examples

```json
{
  "message": {
    "message": "My raw message with interpreted strings like %s",
    "params": ["this"]
  }
}
```

---
title: Threads Interface
sidebar_order: 10
---

The threads interface allows you to specify the threads there were running at
the time an event happened. These threads can also contain stack traces. As per
policy the thread that actually crashed with an exception should not have a
stack trace but instead the `thread_id` attribute should be set on the exception
and Sentry will connect the two.

This interface supports multiple thread values in the `values` key. The
following attributes are known for each value:

`id`:

: **Required**. The ID of the thread. Typically a number or numeric string.
  Needs to be unique among the threads. An exception can set the `thread_id`
  attribute to cross reference this thread.

`crashed`:

: _Optional_. A flag indicating whether the thread crashed.

`current`:

: _Optional_. A flag indicating whether the thread was in the foreground.

`name`:

: _Optional_. The thread name.

`stacktrace`:

: _Optional_. A stack trace object corresponding to the [_Stack Trace
  Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/stacktrace.md -%}).
  
  If this is an error event, the stack trace of the main exception should be
  declared in the [_Exception Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/exception.md -%}) instead.
  Sentry will automatically move the stacktrace of the only crashed thread, if
  there is a single exception.

```json
{
  "threads": {
    "values": [{
      "id": "0",
      "name": "main",
      "crashed": true,
      "stacktrace": {...}
    }]
  }
}
```

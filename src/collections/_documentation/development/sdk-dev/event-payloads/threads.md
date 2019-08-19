---
title: Threads Interface 
sidebar_order: 10
---

The threads interface allows you to specify the threads there were running at the time an event happened. These threads can also contain stack traces. As per policy the thread that actually crashed with an exception should not have a stack trace but instead the `thread_id` attribute should be set on the exception and Sentry will connect the two.

This interface supports multiple thread values in the `values` key. The following attributes are known for each value:

`stacktrace`:

: An optional stack trace object corresponding to the [_Stack Trace 
  Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/stacktrace.md -%}).

`id`:

: The ID of the thread. Typically an integer or short string. Needs to be unique
  among the threads. An exception can set the `thread_id` attribute to cross
  reference this thread.

`crashed`:

: An optional bool to indicate whether the thread crashed.

`current`:

: An optional bool to indicate whether the thread was in the foreground.

`name`:

: An optional thread name.

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

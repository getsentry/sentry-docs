---
title: 'Threads Interface'
sidebar_order: 8
---

The threads interface allows you to specify the threads there were running at the time an event happened. These threads can also contain stack traces. As per policy the thread that actually crashed with an exception should not have a stack trace but instead the `thread_id` attribute should be set on the exception and Sentry will connect the two.

This interface supports multiple thread values in the `values` key. The following attributes are known for each value:

`stacktrace`:

: You can also optionally bind a [_stack trace_]({%- link _documentation/development/sdk-dev/interfaces/stacktrace.md -%}) to the thread.

`id`:

: The ID of the thread. Typically an integer or short string. Needs to be unique among the threads. An exception can set the `thread_id` attribute to cross reference this thread.

`crashed`:

: An optional bool to indicate that the thread crashed.

`current`:

: An optional bool to indicate that the thread was in the foreground.

`name`:

: an optional thread name.

```json
"threads": {
  "values": [{
    "id": "0",
    "name": "main",
    "crashed": true,
    "stacktrace": {...}
}
```

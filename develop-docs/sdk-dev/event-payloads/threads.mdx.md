---
title: Threads Interface
sidebar_order: 10
---

The Threads Interface specifies threads that were running at the time an event
happened. These threads can also contain stack traces.

An [event]({%- link _documentation/development/sdk-dev/event-payloads/index.md
-%}) may contain one or more threads in an attribute named `threads`.

The `threads` attribute should be an object with the attribute `values`
containing one or more values that are objects in the format described below.

As per Sentry policy, the thread that crashed with an [exception]({%- link
_documentation/development/sdk-dev/event-payloads/exception.md -%}) should not
have a stack trace, but instead, the `thread_id` attribute should be set on the
exception and Sentry will connect the two.

## Attributes

`id`:

: **Required**. The ID of the thread. Typically a number or numeric string.
  Needs to be unique among the threads. An exception can set the `thread_id`
  attribute to cross-reference this thread.

`crashed`:

: _Optional_. A flag indicating whether the thread crashed. Defaults to `false`.

`current`:

: _Optional_. A flag indicating whether the thread was in the foreground.
  Defaults to `false`.

`name`:

: _Optional_. The thread name.

`stacktrace`:

: _Optional_. A stack trace object corresponding to the [_Stack Trace
  Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/stacktrace.md -%}).
  
  If this is an error event, the stack trace of the main exception should be
  declared in the [_Exception Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/exception.md -%}) instead.
  Sentry will automatically move the stack trace of the only crashed thread, if
  there is a single exception.

## Examples

The following example illustrates the threads part of the [event payload]({%-
link _documentation/development/sdk-dev/event-payloads/index.md -%}) and omits
other attributes for simplicity.

```json
{
  "threads": {
    "values": [
      {
        "id": "0",
        "name": "main",
        "crashed": true,
        "stacktrace": {}
      }
    ]
  }
}
```

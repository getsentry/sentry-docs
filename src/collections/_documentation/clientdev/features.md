---
title: 'Expected Features'
---

The following is a description of features that are commonly expected in Sentry SDKs.

## Uncaught exception handler

Ability for the SDK to be set as a hook to record any uncaught exceptions. At the language level this is typically a global hook provided by the language itself. For framework intergations this is typically part of middleware or some other system.

## Setting Attributes

Ability to set attributes on events sent to Sentry. They should be configurable “globally” on the client itself (so that they are sent with all future events) and also per event. Important examples are being able to set the `release`, `environment`, `tags` and `extra`. [See the attributes page]({%- link _documentation/clientdev/attributes.md -%}#attributes) for more information and examples.

## Automatic Attributes

Automatic addition of useful attributes such as `tags` or `extra`. Typically means the SDK hooks into a framework so that it can set attributes that are known to be useful for most users.

## Context system

A system for storing data that has to do with a given context. What context means depends on the application, for a web framework it is most likely a single request/response cycle. For a mobile application there is often just one single context that represents the single user and their actions. Context can be difficult to implement because it often has to deal with threads or concurrency and can involve deep integration with frameworks. [See the context page]({%- link _documentation/clientdev/context.md -%}#context) for more information.

## Breadcrumbs

Manually record application events (into the current context) during the lifecycle of an application. Needs to implement a ring buffer so as not to grow indefinitely. The most recent breadcrumbs should be attached to events as they are created.

With deeper framework integration, the automatic recording of some breadcrumbs is possible and recommended.

## Event Sampling

SDKs should allow the user to configure what percentage of events are actually sent to the server (the rest should be silently ignored). For example:

```python
sample_rate = options.get('sample_rate', 1.0)

# assuming random() returns a value between 0.0 (inclusive) and 1.0 (exclusive)
if random() < sample_rate:
    client.send(data)
```

## HTTP 429 Retry-After backoff

Respect Sentry’s HTTP 429 Retry-After header when the user goes over their limits. Events should be dropped during backoff.

## Ignore patterns

The user should be able to define exceptions that are ignored/dropped based on the error message or type.

## In-App frames

Stack parsing can tell which frames should be identified as part of the user’s application (as opposed to part of the language, a library, or a framework), either automatically or by user configuration at startup, often declared as a package/module prefix.

## Surrounding source in stacktrace

Lines of source code to provide context in stacktraces. This is easier in interpreted languages, may be hard or impossible in compiled ones.

## Variable values

Local variable names and values for each stack frame, where possible. Restrictions apply on some platforms, for example it’s may only be possible to collect the values of parameters passed into each function, or it may be completely impossible to collect this information at all.

## Desymbolication

Turn compiled or obfuscated code/method names in stacktraces back into the original. Desymbolication always requires Sentry backend support. Not necessary for many languages.

## Configuration via the runtime environment

Whether static client configuration can set/overridden by the runtime environment _without changing code_. For example, a _SENTRY_RELEASE=1.3_ environment variable that configures the client. Important so that users can package/compile their applications once and adjust Sentry config without rebuilding (very common now for all languages because of the popularity of containers). Not available or doesn’t make sense on some runtimes (browsers, mobile).

## Retrieve last event ID

Ability to get the ID of the last event sent. Event IDs are useful for correlation, logging, customers rolling their own feedback forms, etc.

## User feedback

On user-facing platforms such as mobile or the browser this means first class support for requesting user feedback when an error occurs.

On backend platforms, SDKs should document how to use the last event ID to prompt the user for feedback themselves.

## Pre-send hook

Hook called with the event **and** thrown exception (where applicable) that allow the user to decide whether an event should be sent or not.

## Post-send hook

Hook called on success **or** error, and passed the event and exception so that users can peform actions based on events actually being sent.

## List loaded libraries

Include a list of loaded libraries (and versions) when sending an event.

## Buffer to disk

Write events to disk before attempting to send, so that they can be retried in the event of a temporary network failure. Needs to implement a cap on the number of stored events.

This is mostly useful on mobile clients where connectivity is often not available.

## HTTP Proxy

Ability to use an HTTP proxy. Often easy to implement using the existing HTTP client.

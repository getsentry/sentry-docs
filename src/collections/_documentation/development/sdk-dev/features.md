---
title: 'Expected Features'
sidebar_order: 2
---

The following is a description of features that are commonly expected in Sentry SDKs.  Make sure to also
have read the [unified API design]({% link _documentation/development/sdk-dev/unified-api.md %}) documentation
which explains the common API design.

## Background Sending

Events should be transmitted in a background thread or similar system.  This queue must be flushed when the
application shuts down with a specific timeout.  This feature is typically user facing and explained
as part of [shutdown and draining]({% link _documentation/error-reporting/configuration/draining.md %}).

## Uncaught Exception Handler

Ability for the SDK to be set as a hook to record any uncaught exceptions. At the language level this is typically a global hook provided by the language itself. For framework integrations this might be part of middleware or some other system.

This behavior is typically provided by a default integration that can be disabled.

## Scopes

Scopes should be provided by SDKs to set common attributes and context data on events sent to Sentry emitted from the current scope. They should be inherited to lower scopes so that they can be set "globally" on startup.  Note that some attributes can only be set in the client options (`release`, `environment`) and not on scopes.

What scope means depends on the application, for a web framework it is most likely a single request/response cycle. For a mobile application there is often just one single scope that represents the single user and their actions. Scoping can be difficult to implement because it often has to deal with threads or concurrency and can involve deep integration with frameworks. [See the scopes page]({%- link _documentation/development/sdk-dev/unified-api.md -%}#scope) for more information.

## Automatic Context Data

Automatic addition of useful attributes such as `tags` or `extra` or specific `contexts`. Typically means the SDK hooks into a framework so that it can set attributes that are known to be useful for most users.

## Breadcrumbs

Manually record application events (into the current context) during the lifecycle of an application. Needs to implement a ring buffer so as not to grow indefinitely. The most recent breadcrumbs should be attached to events as they are created.

With deeper framework integration, the automatic recording of some breadcrumbs is possible and recommended.

## Event Sampling

SDKs should allow the user to configure what percentage of events are actually sent to the server (the rest should be silently ignored). For example:

```python
sample_rate = options.get('sample_rate', 1.0)

# assuming random() returns a value between 0.0 (inclusive) and 1.0 (exclusive)
if random() < sample_rate:
    transport.capture_event(event)
```

## HTTP 429 Retry-After backoff

Respect Sentry’s HTTP 429 Retry-After header when the user goes over their limits. Events should be dropped during backoff.

## In-App frames

Stack parsing can tell which frames should be identified as part of the user’s application (as opposed to part of the language, a library, or a framework), either automatically or by user configuration at startup, often declared as a package/module prefix.

## Surrounding Source in Stack Trace

Lines of source code to provide context in stack traces. This is easier in interpreted languages, may be hard or impossible in compiled ones.

## Local Variables

Local variable names and values for each stack frame, where possible. Restrictions apply on some platforms, for example it’s may only be possible to collect the values of parameters passed into each function, or it may be completely impossible to collect this information at all.

## Desymbolication

Turn compiled or obfuscated code/method names in stack traces back into the original. Desymbolication always requires Sentry backend support. Not necessary for many languages.

## Retrieve Last Event ID

Ability to get the ID of the last event sent. Event IDs are useful for correlation, logging, customers rolling their own feedback forms, etc.

## User Feedback

On user-facing platforms such as mobile or the browser this means first class support for requesting user feedback when an error occurs.

On backend platforms, SDKs should document how to use the last event ID to prompt the user for feedback themselves.

## Before-Send Hook

Hook called with the event (and on some platforms the hint) that allow the user to decide whether an event should be sent or not.  This can also be used to further modify the event.

## Before-Breadcrumb Hook

Hook called with the breadcrumb (and on some platforms the hint) that allow the user to decide whether and how a breadcrumb should be sent.

## List Loaded Libraries

Include a list of loaded libraries (and versions) when sending an event.

## Buffer to Disk

Write events to disk before attempting to send, so that they can be retried in the event of a temporary network failure. Needs to implement a cap on the number of stored events.

This is mostly useful on mobile clients where connectivity is often not available.

## HTTP Proxy

Ability to use an HTTP proxy. Often easy to implement using the existing HTTP client.  This should be picked up from the system config if possible or explicit config in the client options.

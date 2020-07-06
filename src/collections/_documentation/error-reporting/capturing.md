---
title: Capturing Events
sidebar_order: 1
---

Out of the box SDKs will attempt to hook themselves into your runtime environment
or framework to automatically report fatal errors.  However in many situations
it's useful to manually report errors or messages to Sentry.  This is called
"capturing".  When an event is captured it's sent to Sentry and will create a new
issue group or be added to an already existing one based on Sentry's grouping
algorithm.  Separately to capturing you can also record "breadcrumbs" that lead
up to an event.  Breadcrumbs are different in that they will not create an event
in Sentry but will be buffered until the next event is sent.  For more information
have a look at [the breadcrumbs documentation](/enriching-error-data/breadcrumbs/).

## Capturing Errors / Exceptions

The most common form of capturing is to capture errors.  What can be captured as an
error will depend on the platform.  In general if you have something that looks like
an exception it can be captured.  For some SDKs you can also omit the argument to
`capture_exception` and it will attempt to capture the current exception.

{% include components/platform_content.html content_dir='capture-error' %}

## Capturing Messages

Another common operation is to capture a bare message.  A message is just some textual
information that should be sent to Sentry.  Typically messages are not emitted but
there are situations when this is useful.

{% include components/platform_content.html content_dir='capture-message' %}

## Capturing Events

SDKs generally also provide ways to capture entire custom event objects.  This is what
integrations internally use to capture bespoke events with a lot of extra data fed
into.  For more information about that consult the API documentation of the SDK.

## Next Steps

* Need to add extra data to your events? Have a look at [our context documentation](/enriching-error-data/additional-data/).

* Captured too much data? Have a look at [filtering](/error-reporting/configuration/filtering/) to remove spam or sensitive information from your events.

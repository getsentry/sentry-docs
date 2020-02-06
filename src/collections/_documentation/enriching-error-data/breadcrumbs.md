---
title: Breadcrumbs
sidebar_order: 2
---

Sentry supports a concept called Breadcrumbs, which is a trail of events which
happened prior to an issue. Often times these events are very similar to
traditional logs, but also have the ability to record more rich structured
data.

Each crumb in the trail has the following attributes:

Message

: A string describing the event. The most common vector, often used as a
  drop-in for a traditional log message.

Data

: A key-value mapping of metadata around the event. This is often used
  instead of message, but may also be used in addition.  All keys here are
  rendered out as table in the breadcrumb on display but some crumb types
  might special case some keys.

Category

: A category to label the event under. This generally is similar to a logger
  name, and will let you more easily understand the area an event took place,
  such as `auth`.

Level

: The level may be any of `fatal`, `error`, `warning`, `info`, or `debug`.

Type

: Additionally, a semi internal attribute `type` exists which can control the type
  of the breadcrumb.  By default all breadcrumbs are recoded as `default` which
  makes it appear as a log entry.  Other types are available which will
  influence how they are rendered.  The following types currently exist:

  * `default`: The default breadcrumb rendering.
  * `http`: Renders the breadcrumb as HTTP request.
  * `error`: Renders the breadcrumb as a hard error.

  _The type is not exclusively used to customize the rendering.  It's
  best not to change the type from the default._

## Recording Crumbs

Manual breadcrumb recording is also available and easy to use.  This way breadcrumbs
can be added whenever something interesting happens.  For instance, it might make sense
to record a breadcrumb if the user authenticates or another state change happens.

{% include components/platform_content.html content_dir='breadcrumbs-example' %}

## Automatic Breadcrumbs

SDKs will automatically start recording breadcrumbs by enabling integrations.  For instance,
the browser JavaScript SDK will automatically record all location changes.

## Breadcrumb Customization

SDKs following the unified API support customizing breadcrumbs through the `before_breadcrumb`
hook.  This hook is passed an already assembled breadcrumb and in some SDKs an optional
hint.  The function can modify the breadcrumb or decide to discard it entirely:

{% include components/platform_content.html content_dir='before-breadcrumb' %}

For information about what can be done with the hint see [_Filtering Events_]({% link _documentation/error-reporting/configuration/filtering.md %}#before-breadcrumb).

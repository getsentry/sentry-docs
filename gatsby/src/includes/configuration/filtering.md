---
title: Filtering events
sidebar_order: 0
---

In case you want to run custom logic on all events, you can do so in the `before-send` callback:
{% include components/platform_content.html content_dir='before-send' %}

## Filtering breadcrumbs

Breadcrumbs can also be individually filtered, see [_Breadcrumbs_](/enriching-error-data/breadcrumbs/#breadcrumb-customization).

## Event hints

When an SDK creates an event or breadcrumb for transmission that is typically created from some sort
of source object.  For instance an error event is typically created from a log record or exception
instance.  For better customization SDKs send these objects to certain callbacks (`before-send`,
`before-breadcrumb` or the event processor system in the SDKs).

### Before Send

The `before-send` callback is passed the `event` and a second argument `hint` which holds one or more
hints.  Typically this hint holds the original exception so that additional data can be extracted
or grouping is affected.
`before-send` will be called right before the event is sent to the server, so it's the last place where you can edit its data.

In this example the fingerprint is forced to a common value if an exception of a certain type has
been caught:

{% include components/platform_content.html content_dir='before-send-hint' %}

This is useful to stop error spam. If you are getting thousands of errors that should really just be one error, you can set a custom fingerprint for that error to group them together. Then you can snooze/ignore that one issue.

### Before Breadcrumb

Similar to `before-send` hints are also supported in `before-breadcrumb`.  This is particularly useful when
breadcrumbs should be augmented or changed with some extra data from log records or events.  The
following example shows a typical situation where you might want to extract extra information and
how to do it:

{% include components/platform_content.html content_dir='before-breadcrumb-hint' %}

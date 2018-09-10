---
title: 'Shutdown and Draining'
sidebar_order: 16
---

Most SDKs use a background queue to send out events.  Because the queue sends asynchronously in the background
it means that some events might be lost if the application shuts down unexpectedly.  To prevent this all SDKs
provide mechanisms to cope with this.

Typically SDKs provide two ways to shut down: a controlled shutdown where the system will wait up to about two
seconds to flush out events (configurable) and an uncontrolled shutdown (also referred to as "killing" the
client).

{% include components/platform_content.html content_dir='drain-example' %}

After shutdown the client cannot be used any more so make sure to only do that right before you shut down
the application.

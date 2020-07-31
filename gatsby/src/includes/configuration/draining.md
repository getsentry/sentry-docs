---
title: 'Shutdown and Draining'
sidebar_order: 1
---

The default behavior of most SDKs is to send out events over the network
asynchronously in the background. This means that some events might be lost if
the application shuts down unexpectedly. The SDKs provide mechanisms to cope
with this.

{% include components/platform_content.html content_dir='drain-example' %}

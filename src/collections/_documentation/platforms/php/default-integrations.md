---
title: Default Integrations
sidebar_order: 10
---

Default integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself. They are documented so you can see
what they do and that they can be disabled if they cause issues. To disable
system integrations set `default_integrations => false` when calling `init()`.

## Core

### RequestIntegration

This integration add request data like `User Agent`, `Cookies`, `Headers` to the event.
Please note that [send_default_pii]({%- link _documentation/error-reporting/configuration/index.md -%}?platform=php#send-default-pii) has to be enabled to also receive PII information.

### ErrorHandlerIntegration

This integration hooks into the global PHP `error_handler` and emits events when an error occurs.
By default the error handler reserves 10 megabytes of memory to handle fatal
errors.

For some frameworks or projects there are specific integrations provided both
officially and by third-party users that automatically register the error
handlers. In that case please refer to their documentation.

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

This integration adds to the event request data like:
 * HTTP method 
 * URL, 
 * query string 

If the [`send_default_pii` option](/error-reporting/configuration/?platform=php#send-default-pii) 
is enabled, it will also send PII information like:
 * user IP address
 * cookies
 * headers

### ErrorListenerIntegration

This integration hooks into the global PHP `error_handler` and emits events when an error occurs.

To do that, it ensures that Sentry's `ErrorHandler` is registered, and adds a callback to it
as an error listener. By default, the `ErrorHandler` reserves 10 kilobytes of memory to handle
fatal errors.

For some frameworks or projects, there are specific integrations provided both
officially and by third-party users that automatically register the error
handlers. In that case, please refer to their documentation.

Also, by default `E_ALL` will be handled, you can change it by setting `error_types`
a different constant in `init()`.

## ExceptionListenerIntegration

This integration catches all global uncaught exceptions and emits events when an error occurs.

To do that, it ensures that Sentry's `ErrorHandler` is registered, and adds a callback to it
as an exception listener.

## FatalErrorListenerIntegration

This integration catches all fatal errors and emits the corresponding events.

To do that, it ensures that Sentry's `ErrorHandler` is registered, and adds a callback to it
as a fatal error listener.


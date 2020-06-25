---
title: Rust
---

{% include learn-sdk.md platform="rust" %}

Sentry-Rust is the official Rust SDK for Sentry. It maps the entire Sentry
protocol for Rust and provides convenient helpers for sending common types of
events to Sentry.

The Rust SDK follows the new unified SDK architecture.  To get started have a
look at the [quickstart](/error-reporting/quickstart/?platform=rust) docs.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks
and libraries.

### Framework integrations

Sentry-Rust supports the following application frameworks:

* [actix-web](/platforms/rust/actix/)

### Error handling integrations

Sentry-Rust supports the most commonly used libraries for advanced error management:

* [failure](/platforms/rust/failure/)
* [error-chain](/platforms/rust/error_chain/)

Additionally you can catch panics using the panic integration:

* [panic](/platforms/rust/panic/)

### Logging integrations

Logs can be automatically converted into breadcrumbs.

* [env_logger](/platforms/rust/env_logger/)
* [log](/platforms/rust/log/)

## More Information

-   [API Docs](http://docs.rs/sentry)
-   [Crates.io page](http://crates.io/crates/sentry)
-   [Bug Tracker](http://github.com/getsentry/sentry-rust/issues)
-   [GitHub Project](http://github.com/getsentry/sentry-rust)

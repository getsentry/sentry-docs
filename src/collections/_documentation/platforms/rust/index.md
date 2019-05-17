---
title: Rust
---

{% include learn-sdk.md platform="rust" %}

Sentry-Rust is the official Rust SDK for Sentry. It maps the entire Sentry
protocol for Rust and provides convenient helpers for sending common types of
events to Sentry.

The Rust SDK follows the new unified SDK architecture.  To get started have a
look at the [quickstart]({% link _documentation/error-reporting/quickstart.md
%}?platform=rust) docs.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks
and libraries.

### Framework integrations

Sentry-Rust supports the following application frameworks:

* [actix-web]({% link _documentation/platforms/rust/actix.md %})

### Error handling integrations

Sentry-Rust supports the most commonly used libraries for advanced error management:

* [failure]({% link _documentation/platforms/rust/failure.md %})
* [error-chain]({% link _documentation/platforms/rust/error_chain.md %})

Additionally you can catch panics using the panic integration:

* [panic]({% link _documentation/platforms/rust/panic.md %})

### Logging integrations

Logs can be automatically converted into breadcrumbs.

* [env_logger]({% link _documentation/platforms/rust/env_logger.md %})
* [log]({% link _documentation/platforms/rust/log.md %})

## More Information

-   [API Docs](http://docs.rs/sentry)
-   [Crates.io page](http://crates.io/crates/sentry)
-   [Bug Tracker](http://github.com/getsentry/sentry-rust/issues)
-   [GitHub Project](http://github.com/getsentry/sentry-rust)

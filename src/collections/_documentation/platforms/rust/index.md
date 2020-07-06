---
title: Rust
---

{% include learn-sdk.md platform="rust" %}

Sentry-Rust is the official Rust SDK for Sentry. It maps the entire Sentry
protocol for Rust and provides convenient helpers for sending common types of
events to Sentry.

The Rust SDK follows the new unified SDK architecture.  To get started have a
look at the [quickstart](/error-reporting/quickstart/?platform=rust) docs and the crates [API Docs](https://docs.rs/sentry).

## Quick Start

```rust
let _guard = sentry::init("___PUBLIC_DSN___");
sentry::capture_message("Hello World!", sentry::Level::Info);
```

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks
and libraries.

A list of integrations and their feature flags can be found
[in the integration API docs](https://docs.rs/sentry/0/sentry/integrations/index.html).

Apart from those, the Rust SDK also supports the following application frameworks:

* [actix-web 0.7](/platforms/rust/actix/)

## More Information

-   [API Docs](http://docs.rs/sentry)
-   [Crates.io page](http://crates.io/crates/sentry)
-   [Bug Tracker](http://github.com/getsentry/sentry-rust/issues)
-   [GitHub Project](http://github.com/getsentry/sentry-rust)

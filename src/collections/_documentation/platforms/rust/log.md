---
title: log
sidebar_order: 2
---

*Feature: `with_log` (enabled by default)*

Adds support for automatic breadcrumb capturing from logs.

The `log` crate is supported in two ways.  First events can be captured as
breadcrumbs for later, secondly error events can be logged as events to Sentry.
By default anything above `Info` is recorded as breadcrumb and anything above
`Error` is captured as error event.

## Configuration

However due to how log systems in Rust work this currently requires you to
slightly change your log setup.  This is an example with the pretty env logger
crate:

```rust
let mut log_builder = pretty_env_logger::formatted_builder().unwrap();
log_builder.parse("info");  // or env::var("RUST_LOG")
let logger = log_builder.build();
let options = sentry::integrations::log::LoggerOptions {
    global_filter: Some(logger.filter()),
    ..Default::default()
};
sentry::integrations::log::init(Some(Box::new(logger)), options);
```

For loggers based on `env_logger` (like `pretty_env_logger`) you can also use
the [`env_logger`](../env_logger/index.html) integration which is much easier
to use.

---
title: env-logger
sidebar_order: 2
---

*Feature: `with_env_logger` (enabled by default)*

Adds support for automatic breadcrumb capturing from logs with `env_logger`.

## Configuration

In the most trivial version you call this crate's init function instead of the
one from `env_logger` and pass `None` as logger:

```rust
sentry::integrations::env_logger::init(None, Default::default());
```

This parses the default `RUST_LOG` environment variable and configures both
`env_logger` and this crate appropriately.  If you want to create your own
logger you can forward it accordingly:

```rust
let mut log_builder = pretty_env_logger::formatted_builder().unwrap();
log_builder.parse("info,foo=debug");
sentry::integrations::env_logger::init(Some(log_builder.build()), Default::default());
```

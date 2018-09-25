---
title: Handling panics
sidebar_order: 2
---

*Feature: `with_panic` (enabled by default)*

A panic handler can be installed that will automatically dispatch all errors to
Sentry that are caused by a panic.

## Configuration

```rust
use sentry::integrations::panic::register_panic_handler;
register_panic_handler();
```

Additionally panics are forwarded to the previously registered panic hook.

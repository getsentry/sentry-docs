---
title: error-chain
sidebar_order: 2
---

*Feature: `with_error_chain` (disabled by default)*

Adds support for the error-chain crate.

Errors created by the `error-chain` crate can be logged with the
`error_chain` integration.

## Example

In your `Cargo.toml`:

```
[dependencies]
sentry = { version = "{% sdk_version sentry.rust %}", features = ["with_error_chain"] }
```

And your Rust code:

```rust
use sentry::integrations::error_chain::capture_error_chain;
let result = match function_that_might_fail() {
    Ok(result) => result,
    Err(err) => {
        capture_error_chain(&err);
        return Err(err);
    }
};
```

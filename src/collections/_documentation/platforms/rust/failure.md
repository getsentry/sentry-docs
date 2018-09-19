---
title: failure
sidebar_order: 2
---

*Feature: `with_failure` (enabled by default)*

Adds support for the failure crate.

Failure errors and `Fail` objects can be logged with the failure integration.
This works really well if you use the `failure::Error` type or if you have
`failure::Fail` objects that use the failure context internally to gain a
backtrace.

## Example

```rust
use sentry::integrations::failure::capture_error;

let result = match function_that_might_fail() {
    Ok(result) => result,
    Err(err) => {
        capture_error(&err);
        return Err(err);
    }
};
```

To capture fails and not errors use `capture_fail`.

In Rust, you can capture any `std::error::Error` type. 

```rust
let result = match function_returns_error() {
    Ok(result) => result,
    Err(err) => {
        sentry::capture_error(&err);
        return Err(err);
    }
};
```

Integrations may provide more specialized capturing methods.

```rust
use sentry::integrations::anyhow::capture_anyhow;

let result = match function_returns_anyhow() {
    Ok(result) => result,
    Err(err) => {
        capture_anyhow(&err);
        return Err(err);
    }
};
```

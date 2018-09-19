In Rust you can capture errors that implement the `Fail` trait or that are `failure::Error`
objects:

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

---
name: Rust
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=rust
support_level: production
type: language
---

To add Sentry to your Rust project you just need to add a new dependency to your `Cargo.toml`:

```toml
[dependencies]
sentry = "0.19.0"
```

`sentry.init()` will return you a guard that when freed, will prevent process exit until all events have been sent (within a timeout):

```rust
let _guard = sentry::init("___PUBLIC_DSN___");
```

One way to verify your setup is by intentionally sending an event that breaks your application.

The quickest way to verify Sentry in your Rust application is to cause a panic:

```rust
fn main() {
    let _guard = sentry::init("___PUBLIC_DSN___");

    // Sentry will capture this
    panic!("Everything is on fire!");
}
```

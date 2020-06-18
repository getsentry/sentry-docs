One way to verify your setup is by intentionally sending an event that breaks your application.

The quickest way to verify Sentry in your Rust application is to cause a panic:

```rust
fn main() {
    let _guard = sentry::init("___PUBLIC_DSN___");

    // Sentry will capture this
    panic!("Everything is on fire!");
}
```

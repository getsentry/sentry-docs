One way to verify your setup is by intentionally sending an event that breaks your application. 

The quickest way to verify Sentry in your Rust application is to cause a panic:

```rust
fn main() {
    // Initialize sentry here

    sentry::integrations::panic::register_panic_handler();

    // Sentry will capture this
    panic!("Everything is on fire!");
}
```

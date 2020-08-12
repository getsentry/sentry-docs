```rust
sentry::init(sentry::ClientOptions {
    before_send: Some(Arc::new(|mut event| {
        // Modify event here
        event.server_name = None;  // Don't send server name
        Some(event)
    })),
    ..Default::default()
});
```

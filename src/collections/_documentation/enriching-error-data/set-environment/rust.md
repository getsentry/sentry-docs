```rust
sentry::init(sentry::ClientOptions {
    environment: Some("{{ page.example_environment }}".into()),
    ..Default::default()
});
```

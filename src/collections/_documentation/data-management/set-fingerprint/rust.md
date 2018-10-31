```rust
sentry::configure_scope(|scope| {
    scope.set_fingerprint(Some(&["my-view-function"]));
});
```

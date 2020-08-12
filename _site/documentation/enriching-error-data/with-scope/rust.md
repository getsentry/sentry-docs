```rust
sentry::with_scope(|scope| {
    scope.set_tag("my-tag", "my value");
}, || {
    // will be tagged with my-tag="my value"
    sentry::capture_message("my error", sentry::Level::Error)
});

// will not be tagged with my-tag
sentry::capture_message("my other error", sentry::Level::Error)
```

*Note that in Rust two callbacks are invoked.  One for configuring the scope, and a second
which is executed in the context of the scope.*

Options are passed to the `init()` as tuple where the first argument is the DSN and the second the options:

```rust
sentry::init(("___PUBLIC_DSN___", sentry::ClientOptions {
    max_breadcrumbs: 50,
    debug: true,
    ..Default::default()
}));
```

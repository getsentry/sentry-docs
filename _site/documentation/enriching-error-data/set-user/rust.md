```rust
sentry::configure_scope(|scope| {
    scope.set_user(Some(sentry::User {
        email: "{{ page.example_user_email }}".to_owned()
        ..Default::default()
    }));
});
```

```rust
sentry::configure_scope(|scope| {
    scope.set_extra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}".to_owned().into());
});
```

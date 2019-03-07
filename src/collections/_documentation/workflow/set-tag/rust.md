```rust
sentry::configure_scope(|scope| {
    scope.set_tag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}");
});
```

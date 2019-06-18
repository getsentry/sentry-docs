```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
    scope.SetTag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}");
})
```

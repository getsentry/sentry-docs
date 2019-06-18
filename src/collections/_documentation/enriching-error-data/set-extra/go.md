```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
    scope.SetExtra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}")
})
```

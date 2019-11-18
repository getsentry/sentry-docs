```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
	scope.SetExtra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}")

    // to set multiple key-value pairs at once:
    scope.SetExtras(map[string]interface{}{
        "{{ page.example_extra_key }}": "{{ page.example_extra_value }}",
        "{{ page.example_extra_key2 }}": "{{ page.example_extra_value2 }}",
    })
})
```

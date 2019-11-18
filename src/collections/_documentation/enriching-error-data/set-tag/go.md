```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
	scope.SetTag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}")

    // to set multiple key-value pairs at once:
    scope.SetTags(map[string]interface{}{
        "{{ page.example_tag_name }}": "{{ page.example_tag_value }}",
        "{{ page.example_tag_name2 }}": "{{ page.example_tag_value2 }}",
    })
})
```

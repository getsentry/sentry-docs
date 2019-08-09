```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
	scope.SetUser(sentry.User{Email: "{{ page.example_user_email }}"})
})
```

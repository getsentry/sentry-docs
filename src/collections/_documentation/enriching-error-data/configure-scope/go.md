```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
	scope.SetTag("my-tag", "my value")
	scope.SetUser(sentry.User{
		ID: "42",
		Email: "john.doe@example.com",
	})
})
```

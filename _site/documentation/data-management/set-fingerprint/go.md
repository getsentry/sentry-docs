```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
	scope.SetFingerprint([]string{"my-view-function"})
})
```
```go
sentry.ConfigureScope(func(scope *sentry.Scope) {
	scope.SetLevel(sentry.LevelWarning)
})
```

```go
sentry.Init(sentry.ClientOptions{
	BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
		if ex, ok := hint.OriginalException.(DatabaseConnectionError); ok {
			event.Fingerprint = []string{"database-connection-error"}
		}

		return event
	},
})
```

For information about which hints are available see [`EventHint` implementation](https://github.com/getsentry/sentry-go/blob/master/interfaces.go).

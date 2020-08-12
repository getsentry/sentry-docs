```go
type DatabaseConnectionError struct {
	message string
}

func (e DatabaseConnectionError) Error() string {
	return e.message
}

sentry.Init(sentry.ClientOptions{
	// ...
	BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
		if ex, ok := hint.OriginalException.(DatabaseConnectionError); ok {
			event.Fingerprint = []string{"database-connection-error"}
		}

		return event
	},
})
```
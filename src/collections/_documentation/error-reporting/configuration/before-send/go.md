In Go, a function can be used to modify the event or return a completely new one. If you return `nil`, the SDK will discard the event.

```go
sentry.Init(sentry.ClientOptions{
	BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
		// Modify the event here
		if event.user != nil {
			// Don't send user's email address
			event.user.email = nil
		}
		
		return event
	},
})
```

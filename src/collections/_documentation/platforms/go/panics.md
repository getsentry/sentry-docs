---
title: Handling Panics
sidebar_order: 3
---

The way to capture unhandled panics in our Go SDK is through the `Recover` method. It can be either used directly through the `defer` keyword or as part of your implementation.

## Usage

When used directly, as shown below, Sentry will recover from the panic and internally decide whether to use the `CaptureException` or `CaptureMessage` method, based on the type of input it received.
As it's not uncommon to panic with a string, it's recommended to use the `AttachStacktrace` option during SDK initialization, which will try to provide a useful stack trace for messages as well.

```go
func() {
	defer sentry.Recover()
	// do all of the scary things here
}()
```

By default, Sentry Go SDK uses asynchronous transport, which in the code example below requires an explicit awaiting for event delivery to be finished using `sentry.Flush` method. It is necessary, because otherwise the program would not wait for the async HTTP calls to return a response, and exit the process immediately when it reached the end of the `main` function. It would not be required inside a running goroutine or if you would use `HTTPSyncTransport`, which you can read about in the `Transports` section.

If you want to control the delivery for a single `defer` call, or do some other things before capturing, you have to use the `Recovery` method on the `Hub` instance directly, as it can accept `err` itself.

```go
func() {
	defer func() {
		err := recover()

		if err != nil {
			sentry.CurrentHub().Recover(err)
			sentry.Flush(time.Second * 5)
		}
	}()

	// do all of the scary things here
}()
```

### Using Context

Besides the regular `Recover` method, there's one more that can be used for panics, namely `RecoverWithContext`.
It allows for passing an instance of `context.Context` as the first argument. This gives us two additional features.

The first one being extracting the `Hub` instance from the context and using it instead of the global one - this is used for every http/server package integration, as it allows for execution context separation. You can see it in action in our `http` integration [source code](https://github.com/getsentry/sentry-go/blob/383614eaf2e038cf3a6d2022c56fb206589efe11/http/sentryhttp.go#L50-L91).

And the second feature, an access to the `context.Context` itself inside the `beforeSend` method, which can be used to extract any additional information about what happened during the panic:

```go
type contextKey int
const SomeContextKey = contextKey(1)

func main() {
	sentrySyncTransport := sentry.NewHTTPSyncTransport()
	sentrySyncTransport.Timeout = time.Second * 3
	
	sentry.Init(sentry.ClientOptions{
		Dsn: "___PUBLIC_DSN___",
		Transport: sentrySyncTransport,
		BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
			if hint.Context != nil {
				// hint.Context.Value(SomeContextKey) would give you stored string that now can be attached to the event
			}
			return event
		},
	})

	ctx := context.WithValue(context.Background(), SomeContextKey, "some details about your panic")

	func() {
		defer sentry.RecoverWithContext(ctx)
		// do all of the scary things here
	}()
}
```

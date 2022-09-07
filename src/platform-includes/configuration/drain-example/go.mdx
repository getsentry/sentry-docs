To avoid unintentionally dropping events when the program terminates, arrange
for `sentry.Flush` to be called, typically using `defer`.

If you use multiple clients, arrange for each of them to be flushed as
appropriate.

`Flush` waits until any buffered events are sent to the Sentry server, blocking
for at most the given timeout. It returns `false` if the timeout was reached. In
that case, some events may not have been sent.

```go
func main() {
	// err := sentry.Init(...)
	defer sentry.Flush(2 * time.Second)

	sentry.CaptureMessage("my message")
}
```

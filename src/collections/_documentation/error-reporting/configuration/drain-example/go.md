The client provides a `Flush` method that takes the time in `time.Duration` for how long it waits and will return a boolean that indicates whether everything was flushed or the timeout kicked in.

```go
sentry.CaptureMessage("my message")

if sentry.Flush(time.Second * 2) {
    fmt.Println("All queued events delivered!")
} else {
    fmt.Println("Flush timeout reached")
}
```

To capture an event in Go, you can pass any struct implementing an `error` interface to `CaptureException()`. If you use a 3rd party library instead of native `errors` package, we'll do our best to extract a stack trace.

The SDK is fully compatible with (but not limited to):
- `github.com/pkg/errors`
- `github.com/go-errors/errors`
- `github.com/pingcap/errors`

If there is an errors package that's not working out of the box, let us know!

```go
f, err := os.Open("filename.ext")
if err != nil {
	sentry.CaptureException(err)
}
```

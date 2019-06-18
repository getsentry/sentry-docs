Import and initialize the Sentry SDK early in your application's setup:

```go
import "github.com/getsentry/sentry-go"

func main() {
    sentry.Init(sentry.ClientOptions{
        Dsn: "___PUBLIC_DSN___",
    })
}
```

The quickest way to verify Sentry in your Go application is to capture an error:

```go
import (
	"errors"
	"github.com/getsentry/sentry-go"
)

func main() {
	sentry.Init(sentry.ClientOptions{
		Dsn: "___DSN___",
	})

	sentry.CaptureException(errors.New("my error"))
}
```

The quickest way to verify Sentry in your Go application is to capture an error:

```go
import (
	"errors"
	"time"
	"github.com/getsentry/sentry-go"
)

func main() {
	sentry.Init(sentry.ClientOptions{
		Dsn: "___DSN___",
	})

	sentry.CaptureException(errors.New("my error"))
	// Since sentry emits events in the background we need to make sure
	// they are sent before we shut down
	sentry.Flush(time.Second * 5)
}
```

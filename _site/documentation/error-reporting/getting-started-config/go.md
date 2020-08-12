Import and initialize the Sentry SDK early in your application's setup:

```go
package main

import (
	"log"

	"github.com/getsentry/sentry-go"
)

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn: "___PUBLIC_DSN___",
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
}
```

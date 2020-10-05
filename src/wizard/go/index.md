---
name: Go
doc_link: https://docs.sentry.io/platforms/go/
support_level: production
type: language
---

Install our Go SDK using [`go get`](https://golang.org/cmd/go/#hdr-Module_aware_go_get):

```bash
go get github.com/getsentry/sentry-go
```

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

The quickest way to verify Sentry in your Go program is to capture a message:

```go
package main

import (
	"log"
	"time"

	"github.com/getsentry/sentry-go"
)

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn: "___PUBLIC_DSN___",
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
	// Flush buffered events before the program terminates.
	defer sentry.Flush(2 * time.Second)

	sentry.CaptureMessage("It works!")
}
```

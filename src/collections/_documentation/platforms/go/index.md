---
title: Go
keywords: ["golang"]
---

{% capture __alert_content -%}
Looking for the old `raven-go` SDK documentation? See the Legacy client section [here]({%- link _documentation/clients/go/index.md -%}). If you want to start using sentry-go instead, check out the [migration guide]({%- link _documentation/platforms/go/migration.md -%}).
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Support"
  content=__alert_content
%}

sentry-go provides a Sentry client implementation for the Go programming language.

## Getting Started

Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
3.  [Configure it](#configure)

<!-- WIZARD -->
## Installation {#install}

sentry-go can be installed like any other Go library through `go get`, and if using Go Modules, it will pick up the latest tagged version:

```bash
$ go get github.com/getsentry/sentry-go
```

## Configuration {#configure}

To use `sentry-go`, you’ll need to import the `sentry-go` package and initialize it with the client options that will include your DSN. If you specify the `SENTRY_DSN` environment variable, you can omit this value from options and it will be picked up automatically for you. The release and environment can also be specified in the environment variables `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` respectively.

More on this in [Configuration]({%- link _documentation/platforms/go/config.md -%}) section.

## Usage {#usage}

The example below shows a sample usage of one of the three primary methods, the `CaptureException` method that allows for sending `error` data to Sentry.
The other two being `CaptureMessage` and `Recover` which you can read more about in [Error Reporting]({%- link _documentation/error-reporting/quickstart.md -%}?platform={{ include.platform }}) and [Capturing Panics]({%- link _documentation/platforms/go/panics.md -%}).

```go
// This is an example program that makes an HTTP request and prints response
// headers. Whenever a request fails, the error is reported to Sentry.
//
// Try it by running:
//
// 	go run main.go
// 	go run main.go https://sentry.io
// 	go run main.go bad-url
//
// To actually report events to Sentry, set the DSN either by editing the
// appropriate line below or setting the environment variable SENTRY_DSN to
// match the DSN of your Sentry project.
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: %s URL", os.Args[0])
	}

	err := sentry.Init(sentry.ClientOptions{
		// Either set your DSN here or set the SENTRY_DSN environment variable.
		Dsn: "___PUBLIC_DSN___",
		// Enable printing of SDK debug messages.
		// Useful when getting started or trying to figure something out.
		Debug: true,
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
	// Flush buffered events before the program terminates.
	// Set the timeout to the maximum duration the program can afford to wait.
	defer sentry.Flush(2 * time.Second)

	resp, err := http.Get(os.Args[1])
	if err != nil {
		sentry.CaptureException(err)
		log.Printf("reported to Sentry: %s", err)
		return
	}
	defer resp.Body.Close()

	for header, values := range resp.Header {
		for _, value := range values {
			fmt.Printf("%s=%s\n", header, value)
		}
	}
}
```

{% capture __alert_content -%}
  By default, Sentry Go SDK uses an asynchronous transport. That means that
  calls to `CaptureException`, `CaptureMessage` and `CaptureEvent` return
  without waiting for network operations. Instead, events are buffered and sent
  over the network in a background goroutine. Call `sentry.Flush` to wait for
  event delivery before the program terminates. You can change the default
  behavior by using a different transport, for example `HTTPSyncTransport`. More
  details in the `Transports` section.
{%- endcapture -%}
{%- include components/alert.html
	level="info"
	title="Awaiting Event Delivery"
	content=__alert_content
%}

<!-- ENDWIZARD -->

## Next Steps

For more detailed information about how to get the most out of `sentry-go` there is additional documentation available:

- [Configuration]({%- link _documentation/platforms/go/config.md -%})
- [Error Reporting]({%- link _documentation/error-reporting/quickstart.md -%}?platform={{ include.platform }})
- [Capturing Panics]({%- link _documentation/platforms/go/panics.md -%})
- [Enriching Error Data]({%- link _documentation/enriching-error-data/context.md -%}?platform={{ include.platform }})
- [Transports]({%- link _documentation/platforms/go/transports.md -%})
- [Goroutines]({%- link _documentation/platforms/go/goroutines.md -%})
- [Integrations]({%- link _documentation/platforms/go/integrations.md -%})
  - [net/http]({%- link _documentation/platforms/go/http.md -%})
  - [echo]({%- link _documentation/platforms/go/echo.md -%})
  - [fasthttp]({%- link _documentation/platforms/go/fasthttp.md -%})
  - [gin]({%- link _documentation/platforms/go/gin.md -%})
  - [iris]({%- link _documentation/platforms/go/iris.md -%})
  - [martini]({%- link _documentation/platforms/go/martini.md -%})
  - [negroni]({%- link _documentation/platforms/go/negroni.md -%})

Resources:

- [Bug Tracker](https://github.com/getsentry/sentry-go/issues)
- [GitHub Project](https://github.com/getsentry/sentry-go)
- [Godocs](https://godoc.org/github.com/getsentry/sentry-go)

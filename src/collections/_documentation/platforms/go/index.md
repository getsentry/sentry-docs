---
title: Go
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

{% capture __alert_content -%}
  By default, Sentry Go SDK uses asynchronous transport, which in the code example below requires an explicit awaiting for event delivery to be finished using `sentry.Flush` method. It is necessary, because otherwise the program would not wait for the async HTTP calls to return a response, and exit the process immediately when it reached the end of the `main` function. It would not be required inside a running goroutine or if you would use `HTTPSyncTransport`, which you can read about in `Transports` section.
{%- endcapture -%}
{%- include components/alert.html
	level="info"
	title="Awaiting Event Delivery"
	content=__alert_content
%}

```go
package main

import (
	"fmt"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
)

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn: "___PUBLIC_DSN___",
	})

	if err != nil {
		fmt.Printf("Sentry initialization failed: %v\n", err)
	}
	
	f, err := os.Open("filename.ext")
	if err != nil {
		sentry.CaptureException(err)
		sentry.Flush(time.Second * 5)
	}
}
```

<!-- ENDWIZARD -->

## Next Steps

For more detailed information about how to get the most out of `sentry-go` there is additional documentation available:

- [Configuration]({%- link _documentation/platforms/go/config.md -%})
- [Error Reporting]({%- link _documentation/error-reporting/quickstart.md -%}?platform={{ include.platform }})
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

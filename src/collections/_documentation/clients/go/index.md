---
title: Go
sidebar_order: 5
sidebar_relocation: platforms
---

{% capture __alert_content -%}
The Go SDK is maintained and supported by Sentry but currently under development. Learn more about the project on [GitHub](https://github.com/getsentry/raven-go).
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Support"
  content=__alert_content
%}

Raven-Go provides a Sentry client implementation for the Go programming language.

## Getting Started
Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
3.  [Configure it](#configure)

<!-- WIZARD -->
## Installation {#install}

Raven-Go can be installed like any other Go library through `go get`:

```bash
$ go get github.com/getsentry/raven-go
```

## Configuring the Client {#configure}

To use `raven-go`, you’ll need to import the `raven` package, then initilize your DSN globally. If you specify the `SENTRY_DSN` environment variable, this will be done automatically for you. The release and environment can also be specified in the environment variables `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` respectively.

```go
package main

import "github.com/getsentry/raven-go"

func init() {
    raven.SetDSN("___DSN___")
}
```

## Reporting Errors

In Go, there are both errors and panics, and Raven can handle both. To learn more about the differences, please read [Error handling and Go](https://blog.golang.org/error-handling-and-go).

To handle normal `error` responses, we have two options: `CaptureErrorAndWait` and `CaptureError`. The former is a blocking call, for a case where you’d like to exit the application after reporting, and the latter is non-blocking.

```go
f, err := os.Open("filename.ext")
if err != nil {
    raven.CaptureErrorAndWait(err, nil)
    log.Panic(err)
}
```

## Reporting Panics

Capturing a panic is pretty simple as well. We just need to wrap our code in `CapturePanic`. `CapturePanic` will execute the `func` and if a panic happened, we will record it, and gracefully continue.

```go
raven.CapturePanic(func() {
    // do all of the scary things here
}, nil)
```
<!-- ENDWIZARD -->

## Additional Context

All of the `Capture*` functions accept an additional argument for passing a `map` of tags as the second argument. For example:

```go
raven.CaptureError(err, map[string]string{"browser": "Firefox"})
```

Tags in Sentry help to categories and give you more information about the errors that happened.

## Event Sampling

To setup client side sampling you can use `SetSampleRate` Client function. Error sampling is disabled by default (sampleRate=1).

```go
package main

import "github.com/getsentry/raven-go"

func init() {
    raven.SetSampleRate(0.25)
}
```

## Deep Dive

For more detailed information about how to get the most out of `raven-go` there is additional documentation available that covers all the rest:

- [Integrations]({%- link _documentation/clients/go/integrations/index.md -%})
  - [net/http]({%- link _documentation/clients/go/integrations/http.md -%})

Resources:

- [Bug Tracker](https://github.com/getsentry/raven-go/issues)
- [GitHub Project](https://github.com/getsentry/raven-go)
- [Godocs](https://godoc.org/github.com/getsentry/raven-go)

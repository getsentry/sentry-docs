---
title: Integrations
---

The Raven Go package currently comes with an integration for the native `net/http` module to make it easy to handle common scenarios. More frameworks will be coming soon.

## net/http

Raven Go provides middleware that can be used with the stdlib `net/http` library to automatically handle panics that occur during an http request.

<!-- WIZARD http -->
### Installation

Simply install `raven-go` through `go get`:

```bash
$ go get github.com/getsentry/raven-go
```

### Setup

Make sure that you’ve set configured `raven` with your DSN, typically inside the `init()` in your `main` package is a good place.

```go
package main

import "github.com/getsentry/raven-go"

func init() {
	raven.SetDSN("___PUBLIC_DSN___")
}
```

If you don’t call `SetDSN`, we will attempt to read it from your environment under the `SENTRY_DSN` environment variable. The release and environment will also be read from the environment variables `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` if set.

Next, we need to wrap our `http.Handler` with our `RecoveryHandler`:

```go
func raisesError(w http.ResponseWriter, r *http.Request) {
	panic("My first Sentry error!")
}

http.HandleFunc("/debug-sentry", raven.RecoveryHandler(raisesError))
```

You can use the above snippet to verify the Sentry integration by visiting the above route in your application and verifying the error in Sentry.
<!-- ENDWIZARD -->

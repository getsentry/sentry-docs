---
title: Configuration
sidebar_order: 2
---

The Sentry Go SDK has some configurable options, which can enhance your user experience, as well as help you streamline your error tracking.

All available options are passed to the `Init()` call in the form of the `ClientOptions` struct with the options described below:

```go
// ClientOptions that configures a SDK Client
type ClientOptions struct {
	// The DSN to use. If the DSN is not set, the client is effectively disabled.
	Dsn string
	// In debug mode, the debug information is printed to stdout to help you understand what
	// sentry is doing.
	Debug bool
	// Configures whether SDK should generate and attach stacktraces to pure capture message calls.
	AttachStacktrace bool
	// The sample rate for event submission (0.0 - 1.0, defaults to 1.0)
	SampleRate float64
	// List of regexp strings that will be used to match against event's message
	// and if applicable, caught errors type and value.
	// If the match is found, then a whole event will be dropped.
	IgnoreErrors []string
	// Before send callback.
	BeforeSend func(event *Event, hint *EventHint) *Event
	// Before breadcrumb add callback.
	BeforeBreadcrumb func(breadcrumb *Breadcrumb, hint *BreadcrumbHint) *Breadcrumb
	// Integrations to be installed on the current Client, receives default integrations
	Integrations func([]Integration) []Integration
	// io.Writer implementation that should be used with the `Debug` mode
	DebugWriter io.Writer
	// The transport to use.
	// This is an instance of a struct implementing `Transport` interface.
	// Defaults to `httpTransport` from `transport.go`
	Transport Transport
	// The server name to be reported.
	ServerName string
	// The release to be sent with events.
	Release string
	// The dist to be sent with events.
	Dist string
	// The environment to be sent with events.
	Environment string
	// Maximum number of breadcrumbs.
	MaxBreadcrumbs int
	// An optional pointer to `http.Client` that will be used with a default HTTPTransport.
	// Using your own client will make HTTPTransport, HTTPProxy, HTTPSProxy and CaCerts options ignored.
	HTTPClient *http.Client
	// An optional pointer to `http.Transport` that will be used with a default HTTPTransport.
	// Using your own transport will make HTTPProxy, HTTPSProxy and CaCerts options ignored.
	HTTPTransport *http.Transport
	// An optional HTTP proxy to use.
	// This will default to the `http_proxy` environment variable.
	// or `https_proxy` if that one exists.
	HTTPProxy string
	// An optional HTTPS proxy to use.
	// This will default to the `HTTPS_PROXY` environment variable
	// or `http_proxy` if that one exists.
	HTTPSProxy string
	// An optional CaCerts to use.
	// Defaults to `gocertifi.CACerts()`.
	CaCerts *x509.CertPool
}
```

### Providing SSL Certificates

By default, TLS uses the host's root CA set. If you don't have `ca-certificates` (which should be your go-to way of fixing the issue of the missing certificates) and want to use `gocertifi` instead, you can provide pre-loaded cert files as one of the options to the `sentry.Init` call:

```go
package main

import (
	"log"

	"github.com/certifi/gocertifi"
	"github.com/getsentry/sentry-go"
)

sentryClientOptions := sentry.ClientOptions{
	Dsn: "___PUBLIC_DSN___",
}

rootCAs, err := gocertifi.CACerts()
if err != nil {
	log.Println("Coudnt load CA Certificates: %v\n", err)
} else {
	sentryClientOptions.CaCerts = rootCAs
}

sentry.Init(sentryClientOptions)
```

### Removing Default Integrations

`sentry-go` SDK has few built-in integrations that enhance events with additional information, or manage them in one way or another.

If you want to read more about them, see the [source code](https://github.com/getsentry/sentry-go/blob/master/integrations.go) directly.

However, there are some cases where you may want to disable some of them. To do this, you can use the `Integrations` configuration option and filter unwanted integrations. For example:

```go
sentry.Init(sentry.ClientOptions{
	Integrations: func(integrations []sentry.Integration) []sentry.Integration {
		var filteredIntegrations []sentry.Integration
		for _, integration := range integrations {
			if integration.Name() == "ContextifyFrames" {
				continue
			}
			filteredIntegrations = append(filteredIntegrations, integration)
		}
		return filteredIntegrations
	},
})
```

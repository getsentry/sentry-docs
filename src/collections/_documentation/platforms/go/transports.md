---
title: Transports
sidebar_order: 3
---

Transports let you change the way, in which events are delivered to Sentry.

The Sentry Go SDK itself, provides two built-in transports. `HTTPTransport`, which is non-blocking and is used by default. And `HTTPSyncTransport` which is blocking. Each transport, provide slightly different configuration options.

## Usage

To configure transport, provide an instance of `sentry.Transport` interface to `ClientOptions`

```go
package main

import (
	"time"

	"github.com/getsentry/sentry-go"
)

func main() {
	sentrySyncTransport := sentry.NewHTTPSyncTransport()
	sentrySyncTransport.Timeout = time.Second * 3
	
	sentry.Init(sentry.ClientOptions{
		Dsn: "___PUBLIC_DSN___",
		Transport: sentrySyncTransport,
	})
}
```

Each transport, provide it's own factory function. `NewHTTPTransport` and `NewHTTPSyncTransport` respectively.

## Options

## HTTPTransport

```go
// HTTPTransport is a default implementation of `Transport` interface used by `Client`.
type HTTPTransport struct {
	// Size of the transport buffer. Defaults to 30.
	BufferSize int
	// HTTP Client request timeout. Defaults to 30 seconds.
	Timeout time.Duration
}
```

## HTTPSyncTransport

```go
// HTTPSyncTransport is an implementation of `Transport` interface which blocks after each captured event.
type HTTPSyncTransport struct {
	// HTTP Client request timeout. Defaults to 30 seconds.
	Timeout time.Duration
}
```
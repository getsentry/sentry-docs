---
title: Serverless
sidebar_order: 5
---

### Source Context

`sentry-go` SDK comes with the support for serverless solutions out of the box.
However, to get the source contexts right, you need to bundle your source code with the binary itself.

For example, when using __AWS Lambda__ and given this tree structure:

```bash
.
├── bin
│   └── upload-image
│   └── process-image
│   └── create-thumbnails
├── functions
│   └── upload-image
│       └── main.go
│   └── process-image
│       └── main.go
│   └── create-thumbnails
│       └── main.go
├── helper
│   ├── foo.go
│   └── bar.go
├── util
│   ├── baz.go
│   └── qux.go

```

You can build one of the binaries and bundle them with the necessary source files with this command:

```bash
$ GOOS=linux go build -o bin/upload-image functions/upload-image/main.go && zip -r handler.zip bin/upload-image functions/upload-image/ helper/ util/
```

The only requirement is that you locate the source code on the deployed machine. Everything else should be done automatically by the SDK.

### Events Delivery

Most (if not all) serverless solutions won't wait for network responses before closing the process.
Because of that, we need to make sure that the event is delivered to Sentry's severs.

It can be achieved twofold, using the `sentry.Flush` method or by swapping the transport to `HTTPSyncTransport`.
Both ways are described in the [Usage]({%- link _documentation/platforms/go/index.md -%}#usage) section of this documentation.

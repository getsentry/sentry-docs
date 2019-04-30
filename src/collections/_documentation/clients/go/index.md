---
title: Go
sidebar_order: 5
sidebar_relocation: platforms
---

{% capture __alert_content -%}
The Sentry Go SDK is maintained and supported by Sentry but currently under development. Learn more about the project on [GitHub](https://github.com/getsentry/raven-go).
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

## Configuration {#configure}

To use `raven-go`, you’ll need to import the `raven` package, then initialize your DSN globally. If you specify the `SENTRY_DSN` environment variable, this will be done automatically for you. The release and environment can also be specified in the environment variables `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` respectively.
More on this in [Configuration]({%- link _documentation/clients/go/config.md -%}) section.

```go
package main

import "github.com/getsentry/raven-go"

func init() {
    raven.SetDSN("___DSN___")
}
```
<!-- ENDWIZARD -->

## Next Steps

For more detailed information about how to get the most out of `raven-go` there is additional documentation available that covers all the rest:

- [Configuration]({%- link _documentation/clients/go/config.md -%})
- [Usage]({%- link _documentation/clients/go/usage.md -%})
- [Context]({%- link _documentation/clients/go/context.md -%})
- [Integrations]({%- link _documentation/clients/go/integrations.md -%})
  - [net/http]({%- link _documentation/clients/go/integrations.md -%})

Resources:

- [Bug Tracker](https://github.com/getsentry/raven-go/issues)
- [GitHub Project](https://github.com/getsentry/raven-go)
- [Godocs](https://godoc.org/github.com/getsentry/raven-go)

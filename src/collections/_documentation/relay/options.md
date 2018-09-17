---
title: 'Configuration Options'
sidebar_order: 2
---

The base configuration for Relay lives in the file `.semaphore/config.yml`.  All keys are `snake_case`.

## Relay

General relay settings.

{:.config-key}
### relay.upstream

*string, default: `https://ingest.sentry.io`*

The upstream relay or sentry instance.

It is not a good idea to set this to a value that will make the relay send errors to itself.

{:.config-key}
### relay.host

*string, default: `127.0.0.1`*

The host the relay should bind to (network interface).  Example: `0.0.0.0`

{:.config-key}
### relay.port

*integer, default: `3000`*

The port to bind for the unencrypted relay HTTP server.  Example: `3000`

{:.config-key}
### relay.tls_port

*integer, optional*

Optional port to bind for the encrypted relay HTTPS server.  Example: `3001`

This is in addition to the `port` option: If you set up a HTTPS server at
`tls_port`, the HTTP server at `port` still exists.

{:.config-key}
### relay.tls_identity_path

*string, optional*

The filesystem path to the identity (DER-encoded PKCS12) to use for the HTTPS
server.  Example: `relay_dev.pfx`

{:.config-key}
### relay.tls_identity_password

*string, optional*

Password for the PKCS12 archive in `tls_identity_path`.

## HTTP

Set various network-related settings.

{:.config-key}
### http.timeout

*integer, default: `5`*

Timeout for upstream requests in seconds.

{:.config-key}
### http.max_retry_interval

*integer, default: `60`*

Maximum interval between failed request retries in seconds.

## Caching

Fine-tune caching of project state.

{:.config-key}
### cache.project_expiry

*integer, default: `300` (5 minutes)*

The cache timeout for project configurations in seconds.  Irrelevant if you use
the "simple proxy mode", where your project config is stored in a local file.

{:.config-key}
### cache.relay_expiry

*integer, default: `3600` (1 hour)*

The cache timeout for downstream relay info (public keys) in seconds.

{:.config-key}
### cache.event_expiry

*integer, default: `600` (10 minutes)*

The cache timeout for events (store) before dropping them.

{:.config-key}
### cache.miss_expiry

*integer, default: `60` (1 minute)*

The cache timeout for non-existing entries.

{:.config-key}
### cache.batch_interval

*integer, default: `100` (100 milliseconds)*

The buffer timeout for batched queries before sending them upstream **in milliseconds**.

{:.config-key}
### cache.file_interval

*integer, default: `10` (10 seconds)*

Interval for watching local cache override files in seconds.

## Size Limits

Controls various HTTP-related limits.  All values are human-readable strings of a number and a human-readable unit, such as:

- `1KiB`
- `1MB`
- `1MiB`
- `1MiB`
- `1025B`

{:.config-key}
### limits.max_event_payload_size

*string, default: `256KB`*

The maximum payload size for events.

{:.config-key}
### limits.max_api_payload_size

*string, default: `20MB`*

The maximum payload size for general API requests.

{:.config-key}
### limits.max_api_file_upload_size

*string, default: `40MB`*

The maximum payload size for file uploads and chunks.

{:.config-key}
### limits.max_api_chunk_upload_size

*string, default: `100MB`*

The maximum payload size for chunks

{:.config-key}
## Logging

{:.config-key}
### logging.level

*string, default: `info`*

The log level for the relay. One of:

- `off`
- `error`
- `warn`
- `info`
- `debug`
- `trace`

{:.config-key}
### logging.log_failed_payloads

*boolean, default: `false`*

If set to true this emits log messages for failed event payloads.

{:.config-key}
### logging.format

*string, default: `auto`*

Controls the log format. One of:

- `auto`: Auto detect (pretty for tty, simplified for other)
- `pretty`: With colors
- `simplified`: Simplified log output
- `json`: Dump out JSON lines

{:.config-key}
### logging.enable_backtraces

*boolean, default: `true`*

When set to true, backtraces are forced on.

{:.config-key}
## Statsd Metrics

{:.config-key}
### metrics.statsd

*string, optional*

If set to a host/port string then metrics will be reported to this statsd
instance.

{:.config-key}
### metrics.prefix

*string, default: `sentry.relay`*

The prefix that should be added to all metrics.

{:.config-key}
## Internal Error Reporting

{:.config-key}
### sentry.enabled

*boolean, default: `false`*

Whether to report internal errors to a separate DSN. `false` means no internal errors are sent (just logged).

{:.config-key}
### sentry.dsn

*string, optional*

DSN to report internal relay failures to.

It is not a good idea to set this to a value that will make the relay send errors to itself. Ideally this should just send errors to Sentry directly, not another relay.

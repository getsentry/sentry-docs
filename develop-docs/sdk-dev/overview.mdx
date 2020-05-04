---
title: Overview
sidebar_order: 0
---

The following is a guide for implementing a new Sentry SDK. It covers the protocol for event submission as well as guidelines for how clients should typically look and behave.

## Writing an SDK

At its core an SDK is a set of utilities for capturing data about an exceptional state in an application. Given this data, it then builds and sends a JSON payload to the Sentry server.

The following items are expected of production-ready SDKs:

-   DSN configuration
-   Graceful failures (e.g. Sentry server is unreachable)
-   Setting attributes (e.g. tags and extra data)
-   Support for Linux, Windows and OS X (where applicable)

Feature based support is required for the following:

-   If cookie data is available, it’s not sent by default
-   If POST data is available, it’s not sent by default

Additionally, the following features are highly encouraged:

-   Automated error capturing (e.g. uncaught exception handlers)
-   Logging framework integration
-   Non-blocking event submission
-   Context data helpers (e.g. setting the current user, recording breadcrumbs)
-   Event sampling
-   Honor Sentry’s HTTP 429 Retry-After header
-   Pre and Post event send hooks
-   Local variable values in stack trace (on platforms where this is possible)

[Please see the features page]({%- link _documentation/development/sdk-dev/features.md -%}#features) for descriptions of commonly expected Sentry SDK features.

## Usage for End-users

Generally, using an SDK consists of three steps for the end user, which should look almost identical no matter the language:

1.  Creation of the SDK (sometimes this is hidden from the user):

    ```javascript
    Sentry.init({dsn: '___DSN___'});
    ```

    ```python
    sentry_sdk.init('___DSN___')
    ```

2.  Capturing an event:

    ```javascript
    var resultId = Sentry.captureException(myException);
    ```

    ```python
    result_id = sentry_sdk.capture_exception(my_exception);
    ```
3.  Using the result of an event capture:

    ```javascript
    alert(`Your exception was recorded as ${resultId}`);
    ```

    ```python
    println('Your exception was recorded as %s', result_id);
    ```

`init` ideally allows several configuration methods. The first argument should always be the DSN value (if possible):

```javascript
Sentry.init({
    'dsn': '___DSN___',
    'foo': 'bar'
})
```

{% capture __alert_content -%}
The SDK should accept an empty DSN as valid configuration.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

Additionally, you should provide global functions which allow for capturing of
a basic message or exception:

-   `Sentry.captureMessage(message)`
-   `Sentry.captureException(exception)`

## Parsing the DSN

SDKs are encouraged to allow arbitrary options via the constructor, but must allow the first argument as a DSN string. This string contains the following bits:

```
'{PROTOCOL}://{PUBLIC_KEY}:{SECRET_KEY}@{HOST}{PATH}/{PROJECT_ID}'
```

The final endpoint you’ll be sending requests to is constructed per the following:

```
 {BASE_URI} = '{PROTOCOL}://{HOST}{PATH}'

'{BASE_URI}/api/{PROJECT_ID}/{ENDPOINT}/'
```

Sentry provides the following endpoints:

- [`/envelope/`]({%- link _documentation/development/sdk-dev/envelopes.md -%})
  for any submission using Envelopes.
- [`/store/`]({%- link _documentation/development/sdk-dev/store.md -%}) for
  plain JSON event submission.
- [`/minidump/`]({%- link _documentation/platforms/native/minidump.md -%}) for
  multipart requests containing Minidumps.
- [`/unreal/`]({%- link _documentation/platforms/native/ue4.md -%}) for Unreal
  Engine 4 crash reports.
- [`/security/`]({%- link
  _documentation/error-reporting/security-policy-reporting.md -%}) for Browser
  CSP reports, usually configured in a browser instead of an SDK.

See the respective endpoints for information on how to compose proper request
payloads.

For example, given the following constructor:

```javascript
Sentry.init({dsn: 'https://public@sentry.example.com/1'})
```

You should parse the following settings:

-   URI = `https://sentry.example.com`
-   Public Key = `public`
-   Secret Key = `secret`
-   Project ID = `1`

The resulting POST request for a plain JSON payload would then transmit to:

```
'https://sentry.example.com/api/1/store/'
```

{% capture __alert_content -%}
The secret part of the DSN is optional and effectively deprecated at this point.  While clients are
still supposed to honor it if supplied future versions of Sentry will entirely ignore it.  The DSN parsing
code must not require the secret key to be set.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

## Authentication

An authentication header is expected to be sent along with the message body,
which acts as an ownership identifier:

```
X-Sentry-Auth: Sentry sentry_version=7,
  sentry_client=<client version, arbitrary>,
  sentry_timestamp=<current timestamp>,
  sentry_key=<public api key>,
  sentry_secret=<secret api key>
```

The `secret_secret` must only be included if a secret key portion was contained
in the DSN.  Future versions of the protocol will fully deprecate the secret
key.

{% capture __alert_content -%}
You should include the SDK version string in the User-Agent portion of the header, and it will be used if `sentry_client` is not sent in the auth header.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

In situations where it’s not possible to send the custom `X-Sentry-Auth` header,
it’s possible to send these values via the querystring:

```
?sentry_version=7&sentry_key=<public api key>&sentry_secret=<secret api key>...
```

`sentry_key`

: **Required.** The public key which should be provided as part of the SDK
  configuration.

`sentry_version`

: **Required.** The protocol version. The current version of the protocol is
  `7`.

`sentry_client`

: An arbitrary string that identifies your SDK, including its version. The
  typical pattern for this is `client_name/client_version`.

  For example, the Python SDK might send this as `raven-python/1.0`.

`sentry_timestamp`

: The unix timestamp representing the time at which this event was generated.

`sentry_secret`

: The secret key which should be provided as part of the SDK configuration.

  This key is effectively deprecated but for the time being should still be
  emitted by SDKs as some older Sentry versions required it in most situations.
  The secret key will be phased out entirely in future versions of Sentry.

## HTTP Headers

We recommend always sending the following headers:

- `content-type`
- `content-length`

The following additional headers are permitted as per CORS policy:

- `x-sentry-auth`
- `x-requested-with`
- `x-forwarded-for`
- `origin`
- `referer`
- `accept`
- `authentication`
- `authorization`
- `content-encoding`
- `transfer-encoding`

## Request Compression

SDKs are heavily encouraged to compress the request body before sending it to
the server to keep the data small. The preferred method for this is to send a
`content-encoding` header. The following content encodings are accepted by Relay
and Sentry:

- `gzip`: Using the [LZ77](http://en.wikipedia.org/wiki/LZ77_and_LZ78#LZ77)
  compression algorithm.
- `deflate`: Using [zlib](http://tools.ietf.org/html/rfc1950) structure with the
  [deflate](http://tools.ietf.org/html/rfc1951) compression algorithm.
- `br`: Using the [Brotli](https://en.wikipedia.org/wiki/Brotli) algorithm.

## Transfer Encoding

Transfer encoding is recommended for only very large requests. Set the header to
`transfer-encoding: chunked`, which allows omission of the `content-length`
header and requires the request body to be wrapped into chunk headers.

See
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
for more details.

## Reading the Response

On success, you will receive an HTTP response from the server containing a JSON
payload with information on the submitted payload:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
}
```

Note the response code which Sentry will use. **Always** check for a `200`
response, which confirms the message was delivered. A small level of validation
happens immediately that may result in a different response code (and message).

## Handling Errors

We **highly encourage** that your SDK handle failures from the Sentry server
gracefully. Specifically, SDKs must honor the `429` status code and not attempt
sending until the `Retry-After` kicks in. SDKs should drop events if Sentry is
unavailable instead of retrying.

To debug an error during development, inspect the response headers and response
body. For example, you may get a response similar to:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
X-Sentry-Error: failed to read request body

{
  "detail":"failed to read request body",
  "causes":[
    "failed to decode zlib payload",
    "corrupt deflate stream"
  ]
}
```

The `X-Sentry-Error` header and response body will not always contain a message,
but they can still be helpful in debugging clients. When emitted, they will
contain a precise error message, which is useful to identify root cause.

{% capture __alert_content -%}
We do not recommend that SDKs retry event submissions automatically on error
&nbsp; not even if `Retry-After` is declared in the response headers. If a
request fails once, it is very likely to fail again on the next attempt.
Retrying too often may cause further rate limiting or blocking by the Sentry
server.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

## Concurrency (Scope and Hubs)

SDKs are supposed to provide standardized concurrency handling through the
concept of hubs and scopes.  This is explained in more details in the
[_Concurrency_]({%- link _documentation/development/sdk-dev/unified-api.md -%}#concurrency) chapter of the unified API docs.

## Layer of Integration

SDKs when possible are supposed to integrate on a low level which will capture as much of the runtime
as possible.  This means that if an SDK can hook the runtime or a framework directly this is preferred
over requiring users to subclass specific base classes (or mix in helpers).  For instance the Python
SDK will monkey patch core functionality in frameworks to automatically pick up on errors and to integrate
scope handling.

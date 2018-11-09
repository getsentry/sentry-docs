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
-   Local variable values in stacktrace (on platforms where this is possible)

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
If an empty DSN is passed, you should treat it as valid option which signifies disabling the SDK.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Additionally, you should provide global functions which allow for capturing of
a basic message or exception:

-   `Sentry.captureMessage(message)`
-   `Sentry.captureException(exception)`

## Parsing the DSN

SDKs are encouraged to allow arbitrary options via the constructor, but must allow the first argument as a DSN string. This string contains the following bits:

```
'{PROTOCOL}://{PUBLIC_KEY}:{SECRET_KEY}@{HOST}/{PROJECT_ID}'
```

The final endpoint you’ll be sending requests to is constructed per the following:

```
'{URI}/api/{PROJECT_ID}/store/'
```

For example, given the following constructor:

```javascript
Sentry.init({dsn: 'https://public:secret@sentry.example.com/1'})
```

You should parse the following settings:

-   URI = `https://sentry.example.com`
-   Public Key = `public`
-   Secret Key = `secret`
-   Project ID = `1`

The resulting POST request would then transmit to:

```
'https://sentry.example.com/api/1/store/'
```

{% capture __alert_content -%}
Note that the secret part of the DSN is optional and effectively deprecated at this point.  While clients are
still supposed to honor it if supplied future versions of Sentry will entirely ignore it.  The DSN parsing
code must not require the secret key to be set.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Building the JSON Packet

The body of the post is a string representation of a JSON object. For example, with an included Exception event, a basic JSON body might resemble the following:

```json
{
  "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0",
  "transaction": "my.module.function_name",
  "timestamp": "2011-05-02T17:41:36",
  "tags": {
    "ios_version": "4.0"
  },
  "exception": {"values":[{
    "type": "SyntaxError",
    "value": "Wattttt!",
    "module": "__builtins__"
  }]}
}
```

The body of the event can carry attributes or interface values. The difference
between them is that attributes are very barebones key/value pairs (for the
most part) and interfaces are rich styled interface elements. Examples of
attribute are `event_id` or `tags` whereas the `exception` key is an interface.

For a list of all supported attributes see [_Attributes_]({%- link
_documentation/development/sdk-dev/attributes.md -%}). For a list of built-in interfaces
see [_Interfaces_]({%- link _documentation/development/sdk-dev/interfaces/index.md -%}).

## Authentication

An authentication header is expected to be sent along with the message body, which acts as an ownership identifier:

```
X-Sentry-Auth: Sentry sentry_version=5,
  sentry_client=<client version, arbitrary>,
  sentry_timestamp=<current timestamp>,
  sentry_key=<public api key>,
  sentry_secret=<secret api key>
```

The `secret_secret` must only be included if a secret key portion was contained in the DSN.  Future versions
of the protocol will fully deprecate the secret key.

{% capture __alert_content -%}
You should include the SDK version string in the User-Agent portion of the header, and it will be used if `sentry_client` is not sent in the auth header.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

In situations where it’s not possible to send the custom `X-Sentry-Auth` header, it’s possible to send these values via the querystring:

```
?sentry_version=5&sentry_key=<public api key>&sentry_secret=<secret api key>...
```

`sentry_version`

: The protocol version. The current version of the protocol is ‘7’.

`sentry_client`

: An arbitrary string which identifies your SDK, including its version.

  The typical pattern for this is ‘**client_name**/**client_version**‘.

  For example, the Python SDK might send this as ‘raven-python/1.0’.

`sentry_timestamp`

: The unix timestamp representing the time at which this event was generated.

`sentry_key`

: The public key which should be provided as part of the SDK configuration.

`sentry_secret`

: The secret key which should be provided as part of the SDK configuration.

  This key is effectively deprecated but for the time being should still be
  emitted by SDKs as some older Sentry versions required it in most situations.
  The secret key will be phased out entirely in future versions of Sentry.

## A Working Example

When all is said and done, you should be sending an HTTP POST request to a Sentry webserver, where the path is the `BASE_URI/api/PROJECT_ID/store/`. So given the following DSN:

```
https://b70a31b3510c4cf793964a185cfe1fd0:b7d80b520139450f903720eb7991bf3d@sentry.example.com/1
```

The request body should then somewhat resemble the following:

```http
POST /api/1/store/ HTTP/1.1
User-Agent: raven-python/1.0
Content-Type: application/json
X-Sentry-Auth: Sentry sentry_version=7,
  sentry_timestamp=1329096377,
  sentry_key=b70a31b3510c4cf793964a185cfe1fd0,
  sentry_secret=b7d80b520139450f903720eb7991bf3d,
  sentry_client=raven-python/1.0

{
  "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0",
  "culprit": "my.module.function_name",
  "timestamp": "2011-05-02T17:41:36",
  "message": "SyntaxError: Wattttt!",
  "exception": {
    "values": [
      {
        "type": "SyntaxError",
        "value": "Wattttt!",
        "module": "__builtins__"
      }
    ]
  }
}
```

## Request Encoding

SDKs are heavily encouraged to gzip or deflate encode the request body before sending it to the server to keep the data small. The preferred method for this is to send an `Content-Encoding: gzip` header. Alternatively the server also accepts gzip compressed json in a base64 wrapper which is detected regardless of the header. This allows you to send compressed events in very restrictive environments.

## Reading the Response

If you’re using HTTP, you’ll receive a response from the server. The response looks something like this:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
}
```

One thing to take note of is the response status code. Sentry uses this in a variety of ways. You’ll **always** want to check for a 200 response if you want to ensure that the message was delivered, as a small level of validation happens immediately that may result in a different response code (and message).

For example, you might get something like this:

```
HTTP/1.1 400 Bad Request
X-Sentry-Error: Client request error: Missing client version identifier

Client request error: Missing client version identifier
```

{% capture __alert_content -%}
The X-Sentry-Error header will not always be present but it can be used to debug clients.  When it can be emitted it will contain the precise error message.  This header is a good way to identify the root cause.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Handling Failures

It is **highly encouraged** that your SDK handles failures from the Sentry server gracefully.  SDKs are expected to honor the 429 status code and to not try sending until the retry-after kicks in.  It's acceptable for SDKs to drop events if Sentry is unavailable instead of retrying.

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

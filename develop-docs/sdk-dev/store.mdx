---
title: Store Endpoint
sidebar_order: 6
---

The store endpoint is used to send JSON event payloads to Sentry. It is located
at:

```
POST /api/<project_id>/store/
```

## Building the JSON Packet

The body of the post is a string representation of a JSON object. For example,
with an included Exception event, a basic JSON body might resemble the
following:

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

For a list of all supported attributes and interfaces in event payloads, see
[_Event Payloads_]({%- link
_documentation/development/sdk-dev/event-payloads/index.md
-%}).

## HTTP Headers

The store endpoint supports only JSON payloads. While not enforced by the
endpoint, we recommend submitting the valid MIME type for JSON payloads:

```
Content-Type: application/json
```

## Request Compression

In addition to standard `content-encoding`, this endpoint accepts gzip
compressed JSON in a base64 wrapper which is detected regardless of the header.
This allows you to send compressed events in very restrictive environments. Do
not set a `content-encoding` header in this case. 

In pseudo code, this maps to:

```py
compressed = base64_encode(gzip.compress(payload))
```

## Size Limits

Event ingestion imposes limits on the size of a store request:

- *200KB* for a compressed store request
- *1MB* for a full event payload after decompression

## A Working Example

To sum everything up, you should be sending an HTTP POST request to a Sentry
webserver, where the path is the `BASE_URI/api/PROJECT_ID/store/`. Given the
following DSN:

```
https://b70a31b3510c4cf793964a185cfe1fd0:b7d80b520139450f903720eb7991bf3d@sentry.example.com/1
```

The request body should resemble the following:

```http
POST /api/1/store/ HTTP/1.1
User-Agent: sentry-python/1.0
Content-Type: application/json
X-Sentry-Auth: Sentry sentry_version=7,
  sentry_timestamp=1329096377,
  sentry_key=b70a31b3510c4cf793964a185cfe1fd0,
  sentry_secret=b7d80b520139450f903720eb7991bf3d,
  sentry_client=sentry-python/1.0

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

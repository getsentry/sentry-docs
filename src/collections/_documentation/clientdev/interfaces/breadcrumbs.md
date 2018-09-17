---
title: 'Breadcrumbs Interface'
sidebar_order: 5
---

The breadcrumbs interface specifies a series of application events, or
“breadcrumbs”, that occurred before the main event. Its canonical name is
`"breadcrumbs"`.

This interface is an object with a sole `values` key containing an ordered list
of breadcrumb objects. The entries are ordered from oldest to newest.
Consequently, the last entry in the array should be the last entry before the
event occurred.

Each breadcrumb has a few properties of which at least `timestamp` and
`category` must be provided. The rest is optional and depending on what is
provided the rendering might be different:

`timestamp`

: **Required**. A timestamp representing when the breadcrumb occurred. This can
be either an ISO datetime string, or a Unix timestamp.

`type`

: _Optional_. The type of breadcrumb. The default type is `default` which
indicates no specific handling. Other types are currently `http` for HTTP
requests and `navigation` for navigation events. More about types later.

`category`

: _Optional_. A dotted string indicating what the crumb is or where it comes
from. Typically it is a module name or a descriptive string. For instance,
_ui.click_ could be used to indicate that a click happend in the UI or _flask_
could be used to indicate that the event originated in the Flask framework.

`message`

: _Optional_. If a message is provided it is rendered as text with all
whitespace preserved. Very long text might be truncated in the UI.

`data`

: _Optional_. Arbitrary data associated with this breadcrumb. Contains a
dictionary whose contents depend on the breadcrumb `type`. See descriptions of
breadcrumb types below. Additional parameters that are unsupported by the type
are rendered as a key/value table.

`level`

: _Optional_. This defines the severity level of the breadcrumb. Allowed values
are, from highest to lowest: `critical`, `error`, `warning`, `info` and `debug`.
Levels are used in the UI to emphasize and deemphasize the crumb. Defaults to
`info`.

## Examples

```json
"breadcrumbs": {
  "values": [
    {
      "timestamp": 1461185753845,
      "message": "Something happened",
      "category": "log",
      "data": {
        "foo": "bar",
        "blub": "blah"
      }
    },
    {
      "timestamp": "2016-04-20T20:55:53.847Z",
      "type": "navigation",
      "data": {
        "from": "/login",
        "to": "/dashboard"
      }
    }
  ]
]
```

## Breadcrumb Types

Below are descriptions of individual breadcrumb types, and what their `data`
properties look like.

### `default`

Describes an generic breadcrumb. This is typically a log message or user
generated breadcrumb. The `data` part is entirely undefined and as such
completely rendered as a key/value table.

```json
{
  "timestamp": 1461185753845,
  "message": "Something happened",
  "category": "log",
  "data": {
    "key": "value"
  }
}
```

### `navigation`

Describes a navigation breadcrumb. A navigation event can be a URL change in a
web application, or a UI transition in a mobile or desktop application, etc.

Its `data` property has the following sub-properties:

`from`

: **Required**. A string representing the original application state / location.

`to`

: **Required**. A string representing the new application state / location.

```json
{
  "timestamp": 1461185753845,
  "type": "navigation",
  "data": {
    "from": "/login",
    "to": "/dashboard"
  }
}
```

### `http`

Describes an HTTP request breadcrumb. This represents an HTTP request
transmitted from your application. This could be an AJAX request from a web
application, or a server-to-server HTTP request to an API service provider, etc.

Its `data` property has the following sub-properties:

`url`

: _Optional_. The request URL.

`method`

: _Optional_. The HTTP request method.

`status_code`

: _Optional_. The HTTP status code of the response.

`reason`

: _Optional_. A text that describes the status code.

```json
{
  "timestamp": 1461185753845,
  "type": "http",
  "data": {
    "url": "http://example.com/api/1.0/users",
    "method": "GET",
    "status_code": 200,
    "reason": "OK"
  }
}
```

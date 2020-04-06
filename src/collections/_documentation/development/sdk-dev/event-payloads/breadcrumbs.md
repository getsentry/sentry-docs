---
title: Breadcrumbs Interface
sidebar_order: 6
---

The Breadcrumbs Interface specifies a series of application events, or
"breadcrumbs", that occurred before an event.

An [event]({%- link _documentation/development/sdk-dev/event-payloads/index.md
-%}) may contain one or more breadcrumbs in an attribute named `breadcrumbs`.

This interface is an object with a single `values` attribute containing an
ordered list of breadcrumb objects. The entries are ordered from oldest to
newest. Consequently, the last entry in the list should be the last entry before
the event occurred.

While breadcrumb attributes are not strictly enforced, a breadcrumb is most
useful when it includes at least a `timestamp` and `type`, `category` or
`message`. The rendering of breadcrumbs in Sentry depends on what is provided.

## Attributes

`timestamp`:

: _Recommended_. A timestamp representing when the breadcrumb occurred. The
  format is either a string as defined in [RFC
  3339](https://tools.ietf.org/html/rfc3339) or a numeric (integer or float)
  value representing the number of seconds that have elapsed since the [Unix
  epoch](https://en.wikipedia.org/wiki/Unix_time).  
  Breadcrumbs are most useful when they include a timestamp, as it creates a
  timeline leading up to an event.

`type`:

: _Optional_. The type of breadcrumb. The default type is `default`, which
  indicates no specific handling. Other types are currently `http` for HTTP
  requests and `navigation` for navigation events. For more information, see the
  [description of recognized breadcrumb types](#breadcrumb-types).

`category`:

: _Optional_. A dotted string indicating what the crumb is or from where it
  comes. Typically it is a module name or a descriptive string. For instance,
  _ui.click_ could be used to indicate that a click happened in the UI or
  _flask_ could be used to indicate that the event originated in the Flask
  framework.

`message`:

: _Optional_. If a message is provided, it is rendered as text with all
  whitespace preserved. Very long text might be truncated in the UI.

`data`:

: _Optional_. Arbitrary data associated with this breadcrumb. Contains a
  dictionary whose contents depend on the breadcrumb `type`. See the
  [description of breadcrumb types](#breadcrumb-types). Additional parameters
  that are unsupported by the type are rendered as a key/value table.

`level`:

: _Optional_. This defines the severity level of the breadcrumb. Allowed values
  are, from highest to lowest: `fatal`, `error`, `warning`, `info`, and `debug`.
  Levels are used in the UI to emphasize and deemphasize the crumb. Defaults to
  `info`.

## Breadcrumb Types

Below are descriptions of individual breadcrumb types, and what their `data`
properties look like.

### `default`

Describes a generic breadcrumb. This is typically a log message or
user-generated breadcrumb. The `data` part is entirely undefined and as such,
completely rendered as a key/value table.

```json
{
  "timestamp": "2016-04-20T20:55:53.845Z",
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

`from`:

: **Required**. A string representing the original application state / location.

`to`:

: **Required**. A string representing the new application state / location.

```json
{
  "timestamp": "2016-04-20T20:55:53.845Z",
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

`url`:

: _Optional_. The request URL.

`method`:

: _Optional_. The HTTP request method.

`status_code`:

: _Optional_. The HTTP status code of the response.

`reason`:

: _Optional_. A text that describes the status code.

```json
{
  "timestamp": "2016-04-20T20:55:53.845Z",
  "type": "http",
  "data": {
    "url": "http://example.com/api/1.0/users",
    "method": "GET",
    "status_code": 200,
    "reason": "OK"
  }
}
```

## Examples

The following example illustrates the breadcrumbs part of the [event
payload]({%- link _documentation/development/sdk-dev/event-payloads/index.md
-%}) and omits other attributes for simplicity.

```json
{
  "breadcrumbs": {
    "values": [
      {
        "timestamp": "2016-04-20T20:55:53.845Z",
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
  }
}
```

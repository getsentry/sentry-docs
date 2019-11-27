---
title: Request Interface
sidebar_order: 8
---

The Request interface contains information on a HTTP request related to the
event. In client SDKs, this can be an outgoing request, or the request that
rendered the current web page. On server SDKs, this could be the incoming web
request that is being handled.

The data variable should only contain the request body (not the query string).
It can either be a dictionary (for standard HTTP requests) or a raw request
body.

## Ordered Maps

In the Request interface, several attributes can either be declared as string,
object, or list of tuples. Sentry attempts to parse structured information from
the string representation in such cases.

Sometimes, keys can be declared multiple times, or the order of elements
matters. In such cases, use the tuple representation over a plain object.

Example of request headers as object:

```json
{
  "content-type": "application/json",
  "accept": "application/json, application/xml"
}
```

Example of the same headers as list of tuples:

```json
[
  ["content-type", "application/json"],
  ["accept", "application/json"],
  ["accept", "application/xml"]
]
```

## Attributes

`method`:

: _Optional_. The HTTP method of the request.

`url`:

: _Optional_. The URL of the request if available. The query string can be
  declared either as part of the `url`, or separately in `query_string`.

`query_string`:

: _Optional_. The query string component of the URL. Can be given as unparsed
  string, dictionary, or list of tuples.
  
  If the query string is not declared and part of the `url` parameter, Sentry
  moves it to the query string.

`data`:

: _Optional_. Submitted data in a format that makes the most sense. SDKs should
  discard large bodies by default. Can be given as string or structural data of
  any format.

`cookies`:

: _Optional_. The cookie values. Can be given unparsed as string, as dictionary,
  or as a list of tuples.
 
`headers`:

: _Optional_. A dictionary of submitted headers. If a header appears multiple
  times it, needs to be merged according to the HTTP standard for header
  merging. Header names are treated case-insensitively by Sentry.

`env`:

: _Optional_. A dictionary containing environment information passed from the
  server. This is where information such as CGI/WSGI/Rack keys go that are not
  HTTP headers.
  
  Sentry will explicitly look for `REMOTE_ADDR` to extract an IP address.

## Examples

A fully populated request interface:

```json
{
  "request": {
    "method": "POST",
    "url": "http://absolute.uri/foo",
    "query_string": "query=foobar&page=2",
    "data": {
      "foo": "bar"
    },
    "cookies": "PHPSESSID=298zf09hf012fh2; csrftoken=u32t4o3tb3gg43; _gat=1;",
    "headers": {
      "content-type": "text/html"
    },
    "env": {
      "REMOTE_ADDR": "192.168.0.1"
    }
  }
}
```

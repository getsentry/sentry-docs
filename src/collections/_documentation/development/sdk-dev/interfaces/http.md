---
title: 'HTTP Interface'
sidebar_order: 7
---

The Request information is stored in the HTTP interface. Two arguments are required: url and `method`.

The `env` variable is a compounded dictionary of HTTP headers as well as environment information passed from the webserver. Sentry will explicitly look for `REMOTE_ADDR` in `env` for things which require an IP address.

The data variable should only contain the request body (not the query string). It can either be a dictionary (for standard HTTP requests) or a raw request body.

`url`

: The full URL of the request if available.

`method`

: The actual HTTP method of the request.

`data`

: Submitted data in whatever format makes most sense. SDKs should discard large bodies by default.

`query_string`

: The unparsed query string as it is provided.

`cookies`

: The cookie values. Typically unparsed as a string.

`headers`

: A dictionary of submitted headers. If a header appears multiple times it needs to be merged according to the HTTP standard for header merging.

`env`

: Optional environment data. This is where information such as CGI/WSGI/Rack keys go that are not HTTP headers.

```json
"request": {
  "url": "http://absolute.uri/foo",
  "method": "POST",
  "data": {
    "foo": "bar"
  },
  "query_string": "hello=world",
  "cookies": "foo=bar",
  "headers": {
    "Content-Type": "text/html"
  },
  "env": {
    "REMOTE_ADDR": "192.168.0.1"
  }
}
```

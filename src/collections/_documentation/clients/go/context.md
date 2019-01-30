---
title: Context
sidebar_order: 3
---

All of the `Capture*` functions accept an additional argument for passing a `map` of tags as the second argument and context data as remaining ones.
Tags in Sentry help to categories and give you more information about the errors that happened, where other context data is more "environment" specific.
(NOTE: direct low-level `Capture` call accepts second argument only - tags, without additional interfaces)

For example:

```go
raven.CaptureError(err, map[string]string{"browser": "Firefox"}, &raven.Http{
  Method: "GET",
  URL: "https://example.com/raven-go"
})
```

This data can be either passed directly to `Capture*` calls or configured globally using functions listed below, if it should be applied to all future events.

{:.config-key}
### `SetHttpContext`

Provides information about an HTTP call that was processed when error happened.

```go
h := &raven.Http{
  Method: "GET",
  URL: "https://example.com/raven-go"
}
// or
h = raven.NewHttp(req) // where req is an implementation of `*http.Request` interface
raven.SetHttpContext(h)
```

{:.config-key}
### `SetTagsContext`

Add new tags to the context, merging them with existing ones.

```go
t := map[string]string{"day": "Friday", "sport": "Weightlifting"}
raven.SetTagsContext(t)
```

{:.config-key}
### `SetUserContext`

Provides information about a User whos session was active when error happened.

```go
u := &raven.User{
  ID: "1337",
  Username: "kamilogorek",
  Email: "kamil@sentry.io",
  IP: "127.0.0.1"
}
raven.SetUserContext(u)
```

{:.config-key}
### `ClearContext`

Sets `Http`, `Tags` and `User` back to `Nil` value.

```go
raven.ClearContext()
```

{:.config-key}
### `WrapWithExtra`

Wraps error object with an arbitrary key/value pair that will be send to Sentry alongside original error.

```go
path := "filename.ext"
f, err := os.Open(path)
if err != nil {
    err = raven.WrapWithExtra(err, map[string]string{"path": path, "cwd": os.Getwd()}
    raven.CaptureErrorAndWait(err, nil)
    log.Panic(err)
}
```


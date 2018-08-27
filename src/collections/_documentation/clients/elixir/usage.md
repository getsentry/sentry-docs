---
title: Usage
sidebar_order: 1
---

## Capturing Errors

If you use the error logger and setup Plug/Phoenix then you are already done, all errors will bubble up to sentry.

Otherwise we provide a simple way to capture exceptions:

```elixir
try do
  ThisWillError.reall()
rescue
  my_exception ->
    Sentry.capture_exception(my_exception, [stacktrace: System.stacktrace(), extra: %{extra: information}])
end
```

## Optional Attributes

With calls to `capture_exception` additional data can be supplied as a keyword list:

> ```elixir
> Sentry.capture_exception(ex, opts)
> ```

`extra`

: Additional context for this event. Must be a mapping. Children can be any native JSON type.

  ```elixir
  extra: %{key: "value"}
  ```

`level`

: The level of the event. Defaults to `error`.

  ```elixir
  level: "warning"
  ```

  Sentry is aware of the following levels:

  -   debug (the least serious)
  -   info
  -   warning
  -   error
  -   fatal (the most serious)

`fingerprint`

: The fingerprint for grouping this event.

`tags`

: Tags to index with this event. Must be a mapping of strings.

  ```elixir
  tags: %{"key" => "value"}
  ```

`user`

: The acting user.

  ```elixir
  user: %{
      "id" => 42,
      "email" => "clever-girl"
  }
  ```

`event_source`

: The source of the event. Used by the _Sentry.EventFilter_ behaviour.

## Breadcrumbs

Sentry supports capturing breadcrumbs – events that happened prior to an issue. We need to be careful because breadcrumbs are per-process, if a process dies it might lose its context.

```elixir
Sentry.Context.add_breadcrumb(%{my: "crumb"})
```

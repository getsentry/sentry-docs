---
title: Usage
sidebar_order: 1
---

<!-- WIZARD -->
## Capturing Errors

If you use the LoggerBackend and set up the Plug/Phoenix integrations, all errors will bubble up to Sentry.

Otherwise, we provide a simple way to capture exceptions manually:

```elixir
try do
  ThisWillError.really()
rescue
  my_exception ->
    Sentry.capture_exception(my_exception, [stacktrace: __STACKTRACE__, extra: %{extra: information}])
end
```
<!-- ENDWIZARD -->

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
      "email" => "email@email.com"
  }
  ```

`event_source`

: The source of the event. Used by the `Sentry.EventFilter` behaviour.

## Breadcrumbs

Sentry supports capturing breadcrumbs – events that happened prior to an issue. We need to be careful because breadcrumbs are per-process.  If a process dies it might lose its context.

```elixir
Sentry.Context.add_breadcrumb(%{my: "crumb"})
```

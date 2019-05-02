---
title: Configuration
---

Configuration is handled using the standard Elixir configuration.

Simply add configuration to the `:sentry` key in the file `config/prod.exs`:

```elixir
config :sentry,
  dsn: "___PUBLIC_DSN___"
```

### Setup with Plug or Phoenix

If using an environment with Plug or Phoenix, add the following to your Plug.Router or Phoenix.Router:

```elixir
use Plug.ErrorHandler
use Sentry.Plug
```

If you are using Phoenix, you can also include [Sentry.Phoenix.Endpoint](https://hexdocs.pm/sentry/Sentry.Phoenix.Endpoint.html) in your Endpoint. This module captures errors occurring in the Phoenix pipeline before the request reaches the Router:

```elixir
use Phoenix.Endpoint, otp_app: :my_app
use Sentry.Phoenix.Endpoint
```

More information on why this may be necessary can be found here: https://github.com/getsentry/sentry-elixir/issues/229 and https://github.com/phoenixframework/phoenix/issues/2791

### Capture Crashed Process Exceptions

This library comes with an extension to capture all error messages that the Plug handler might not.  This is based on [Logger.Backend](https://hexdocs.pm/logger/Logger.html#module-backends).

To set this up, add `{:ok, _} = Logger.add_backend(Sentry.LoggerBackend)` to your application's start function. Example:

```elixir
def start(_type, _opts) do
  children = [
    supervisor(MyApp.Repo, []),
    supervisor(MyAppWeb.Endpoint, [])
  ]

  opts = [strategy: :one_for_one, name: MyApp.Supervisor]

  {:ok, _} = Logger.add_backend(Sentry.LoggerBackend)

  Supervisor.start_link(children, opts)
end
```

The backend can also be configured to capture Logger metadata, which is detailed [here](https://hexdocs.pm/sentry/Sentry.LoggerBackend.html).

## Required settings

`environment_name`

: The name of the environment, this defaults to the `:dev` environment variable.

`dsn`

: The DSN provided by Sentry.

`root_source_code_path`

: This is only required if `enable_source_code_context` is enabled. Should generally be set to `File.cwd!`.

## Optional settings

`included_environments`

: The list of environments you want to send reports to sentry, this defaults to `~w(prod test dev)a`.

`tags`

: The default tags to send with each report.

`release`

: The release to send to sentry with each report. This defaults to nothing.

`server_name`

: The name of the server to send with each report. This defaults to nothing.

`client`

: If you need different functionality for the HTTP client, you can define your own module that implements the _Sentry.HTTPClient_ behaviour and set _client_ to that module.

`filter`

: Set this to a module that implements the `Sentry.EventFilter` behaviour if you would like to prevent certain exceptions from being sent. See below for further documentation.

`hackney_pool_max_connections`

: Number of connections for Sentry’s hackney pool. This defaults to 50.

`hackney_pool_timeout`

: Timeout for Sentry’s hackney pool. This defaults to 5000 milliseconds.

`hackney_opts`

: Sentry starts its own hackney pool named `:sentry_pool`, and defaults to using it. Hackney’s `pool` configuration as well others like proxy or response timeout can be set through this configuration as it is passed directly to hackney when making a request.

`before_send_event`

: This option allows performing operations on the event before it is sent by `Sentry.Client`. Accepts an anonymous function or a {module, function} tuple, and the event will be passed as the only argument.

`after_send_event`

: This option allows performing arbitrary operations after attempting to send an event. Accepts an anonymous function or a {module, function} tuple, and the event will be passed as the first argument, and the result of sending the event will be passed as the second argument.

`sample_rate`

: The sampling factor to apply to events. A value of 0.0 will deny sending any events, and a value of 1.0 will send 100% of events.

`in_app_module_whitelist`

: Expects a list of modules that is used to distinguish among stack trace frames that belong to your app and ones that are part of libraries or core Elixir. This is used to better display the significant part of stack traces. The logic is greedy, so if your app’s root module is `MyApp` and your setting is `[MyApp]`, that module as well as any submodules like `MyApp.Submodule` would be considered part of your app. Defaults to `[]`.

`report_deps`

: Will attempt to load Mix dependencies at runtime to report alongside events. Defaults to _true_.

`enable_source_code_context`

: When true, Sentry will read and store source code files to report the source code that caused an exception.

`context_lines`

: The number of lines of source code before and after the line that caused the exception to be included. Defaults to `3`.

`source_code_exclude_patterns`

: A list of Regex expressions used to exclude file paths that should not be stored or referenced when reporting exceptions. Defaults to `[~r"/_build/", ~r"/deps/", ~r"/priv/"]`.

`source_code_path_pattern`

: A glob that is expanded to select files from the `:root_source_code_path`. Defaults to `"**/*.ex"`.

`json_library`

: The JSON library used to encode HTTP requests.  Defaults to `Jason`.

`log_level`
: This sets the log level used when Sentry fails to send an event due to an invalid event or API error. Defaults to `:warn`.

## Testing Your Configuration

To ensure you’ve set up your configuration correctly, we recommend running the included mix task. It can be tested on different Mix environments and will tell you if it is not currently configured to send events in that environment:

```bash
$ MIX_ENV=dev mix sentry.send_test_event
Client configuration:
server: https://sentry.io/
public_key: public
secret_key: secret
included_environments: [:prod]
current environment_name: :dev

:dev is not in [:prod] so no test event will be sent

$ MIX_ENV=prod mix sentry.send_test_event
Client configuration:
server: https://sentry.io/
public_key: public
secret_key: secret
included_environments: [:prod]
current environment_name: :prod

Sending test event!
```

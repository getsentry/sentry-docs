---
name: Elixir
doc_link: https://docs.sentry.io/platforms/elixir/
support_level: production
type: language
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

## Install {#install}

Edit your mix.exs file to add it as a dependency and add the `:sentry` package to your applications:

```elixir
defp deps do
  [
    # ...
    {:sentry, "~> 8.0"},
    {:jason, "~> 1.1"},
    {:hackney, "~> 1.8"},
    # if you are using plug_cowboy
    {:plug_cowboy, "~> 2.3"}
  ]
end
```

## Configure {#configure}

Setup the application production environment in your `config/prod.exs`

```elixir
config :sentry,
  dsn: "___PUBLIC_DSN___",
  environment_name: :prod,
  enable_source_code_context: true,
  root_source_code_path: File.cwd!(),
  tags: %{
    env: "production"
  },
  included_environments: [:prod]
```

The `environment_name` and `included_environments` work together to determine if and when Sentry should record exceptions. The `environment_name` is the name of the current environment. In the example above, we have explicitly set the environment to `:prod` which works well if you are inside an environment specific configuration like `config/prod.exs`.

An alternative is to use `Mix.env` in your general configuration file:

```elixir
config :sentry, dsn: "___PUBLIC_DSN___",
   included_environments: [:prod],
   environment_name: Mix.env
```

This will set the environment name to whatever the current Mix environment atom is, but it will only send events if the current environment is `:prod`, since that is the only entry in the `included_environments` key.

You can even rely on more custom determinations of the environment name. It's not uncommon for most applications to have a "staging" environment. In order to handle this without adding an additional Mix environment, you can set an environment variable that determines the release level.

```elixir
config :sentry, dsn: "___PUBLIC_DSN___",
  included_environments: ~w(production staging),
  environment_name: System.get_env("RELEASE_LEVEL") || "development"
```

In this example, we are getting the environment name from the `RELEASE_LEVEL` environment variable. If that variable does not exist, it will default to `"development"`. Now, on our servers, we can set the environment variable appropriately. On our local development machines, exceptions will never be sent, because the default value is not in the list of `included_environments`.

If using an environment with Plug or Phoenix, add the following to `Plug.Router` or `Phoenix.Endpoint`:

```elixir
# Phoenix
use Sentry.PlugCapture
use Phoenix.Endpoint, otp_app: :my_app
# ...
plug Plug.Parsers,
 parsers: [:urlencoded, :multipart, :json],
 pass: ["*/*"],
 json_decoder: Phoenix.json_library()
plug Sentry.PlugContext
# Plug
use Plug.Router
use Sentry.PlugCapture
# ...
plug Plug.Parsers,
 parsers: [:urlencoded, :multipart, :json],
 pass: ["*/*"],
 json_decoder: Phoenix.json_library()
plug Sentry.PlugContext
```

`Sentry.PlugContext` gathers the contextual information for errors, and `Sentry.PlugCapture` captures and sends any errors that occur in the Plug stack. `Sentry.PlugContext` should be below `Plug.Parsers` if you are using it.

### Capture Crashed Process Exceptions

This library comes with an extension to capture all error messages that the Plug handler might not. This is based on [Logger.Backend](https://hexdocs.pm/logger/Logger.html#module-backends). You can add it as a backend when your application starts:

```elixir
# lib/my_app/application.ex

def start(_type, _args) do
  Logger.add_backend(Sentry.LoggerBackend)
```

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

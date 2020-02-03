---
title: 'Configuration and Authentication'
sidebar_order: 1
---

For most functionality you need to authenticate with Sentry. Setting this up can be done either automatically, using `sentry-cli`, or manually. Either way, you'll need a token with at least the following scopes:

- `project:read`
- `project:releases`
- `org:read`

##### To use the automatic option:

```bash
$ sentry-cli login
```

This will give you the option to visit your auth token user settings, where you can create a new auth token, or simply copy an existing one. When you return to the CLI, you'll paste in your token and it will get added to `~/.sentryclirc` automatically.

By default, `sentry-cli` will connect to sentry.io, but for self-hosted you can also sign in elsewhere:

```bash
$ sentry-cli --url https://myserver.invalid/ login
```

##### To authenticate manually:

Visit your [auth token user settings page](https://sentry.io/settings/account/api/auth-tokens/) and create or copy an existing token. Then either:

- add it to `~/.sentryclirc`:
  ```ini
  [auth]
  token=your-auth-token
  ```
- export it as an environment variable:
  ```bash
  export SENTRY_AUTH_TOKEN=your-auth-token
  ```
- pass it as a parameter when you invoke `sentry-cli`:
  ```bash
  $ sentry-cli --auth-token your-auth-token
  ```

## Configuration File

The `sentry-cli` tool can be configured with a config file named `.sentryclirc` as well as environment variables and `.env` files. The config file is looked for upwards from the current path and defaults from `~/.sentryclirc` are always loaded. You can also override these settings from command line parameters.

The config file uses standard INI syntax.

By default `sentry-cli` will connect to sentry.io. For on-prem you can export the `SENTRY_URL` environment variable and point it to your installation:

```bash
export SENTRY_URL=https://mysentry.invalid/
```

Alternatively you can add it to your `~/.sentryclirc` config. This is also what the `login` command does:

```ini
[defaults]
url = https://mysentry.invalid/
```

{% capture __alert_content -%}
By default sentry-cli loads .env files. On versions of sentry-cli 1.24 and newer you can disable this by exporting an environment variable `SENTRY_LOAD_DOTENV=0`.
{%- endcapture -%}
{%- include components/alert.html
  title=".env file loading"
  content=__alert_content
%}

## Configuration Values

The following settings are available (first is the environment variable, the value in the parentheses is the config key in the config file):

`SENTRY_AUTH_TOKEN` (_auth.token_):

: The authentication token to use for all communication with Sentry.

`SENTRY_API_KEY` (_auth.api_key_):

: The legacy API key for authentication if you have one.

`SENTRY_DSN` (_auth.dsn_):

: The DSN to use to connect to sentry.

`SENTRY_URL` (_defaults.url_):

: The URL to use to connect to sentry. This defaults to `https://sentry.io/`.

`SENTRY_ORG` (_defaults.org_):

: The slug of the organization to use for a command.

`SENTRY_PROJECT` (_defaults.project_):

: The slug of the project to use for a command.

`SENTRY_VCS_REMOTE` (_defaults.vcs_remote_):

: The name of the _remote_ in the versioning control system. This defaults to `origin`.

(_http.keepalive_):

: This ini only setting is used to control the behavior of the SDK with regards to HTTP keepalives. The default is _true_ but it can be set to _false_ to disable keepalive support.

`http_proxy` (_http.proxy_url_):

: The URL that should be used for the HTTP proxy. The standard `http_proxy` environment variable is also honored. Note that it is lowercase.

(_http.proxy_username_):

: This ini only setting sets the proxy username in case proxy authentication is required.

(_http.proxy_password_):

: This ini only setting sets the proxy password in case proxy authentication is required.

(_http.verify_ssl_):

: This can be used to disable SSL verification when set to false. You should never do that unless you are working with a known self signed server locally.

(_http.check_ssl_revoke_):

: If this is set to false then SSL revocation checks are disabled on Windows. This can be useful when working with a corporate SSL MITM proxy that does not properly implement revocation checks. Do not use this unless absolutely necessary.

`SENTRY_HTTP_MAX_RETRIES` (_http.max_retries_):

: Sets the maximum number of retry attempts for upload operations (e.g., uploads of release files and debug symbols). The default is `5`.

(_ui.show_notifications_):

: If this is set to false some operating system notifications are disabled. This currently primarily affects xcode builds which will not show notifications for background builds.

`SENTRY_LOG_LEVEL` (_log.level_):

: Configures the log level for the SDK. The default is `warning`. If you want to see what the library is doing you can set it to `info` which will spit out more information which might help to debug some issues with permissions.

(_dsym.max_upload_size_):

: Sets the maximum upload size in bytes (before compression) of debug symbols into one batch. The default is 35MB or 100MB (depending on the version of sentry-cli) which is suitable for sentry.io but if you are using a different sentry server you might want to change this limit if necessary.

`SENTRY_NO_PROGRESS_BAR`:

: If set to `1`, then `sentry-cli` will not display progress bars for any operations.

`SENTRY_DISABLE_UPDATE_CHECK` (_update.disable_check_):

: If set to `true`, then the automatic update check in sentry-cli is disabled. This was introduced in 1.17. Versions before that did not include an update check. The update check is also not enabled for npm based installations of sentry-cli at the moment.

`DEVICE_FAMILY` (_device.family_):

: Device family value reported to Sentry.

`DEVICE_MODEL` (_device.model_):

: Device model value reported to Sentry.

## Validating The Config

To make sure everything works you can run `sentry-cli info` and it should print out some basic information about the Sentry installation you connect to as well as some authentication information.

## Working with Projects {#sentry-cli-working-with-projects}

Many commands require you to specify the organization and project to work with. There are multiple ways in which you can specify this.

### Config Defaults

If you are always working with the same projects you can set it in the `.sentryclirc` file:

```ini
[defaults]
project=my-project
org=my-org
```

### Environment Variables

You can also set these defaults in environment variables. There are two environment variables that control this (`SENTRY_ORG` and `SENTRY_PROJECT`) which you can export:

```bash
export SENTRY_ORG=my-org
export SENTRY_PROJECT=my-project
```

### Properties Files

Additionally `sentry-cli` supports loading configuration values from `.properties` files (common in the Java environment). You can instruct `sentry-cli` to load config files from there by exporting the path to a properties file in the `SENTRY_PROPERTIES` environment variable. This is commonly done automatically for some of our client integrations like Java and React-Native.

Inside the properties files you just use the dotted notation to set values. Example:

```ini
defaults.url=https://mysentry.invalid/
```

To then instruct `sentry-cli` to use that file use this:

```bash
export SENTRY_PROPERTIES=/path/to/sentry.properties
sentry-cli ...
```

### Explicit Options

Lastly you can also provide these values explicitly to the command you are executing. The parameters are always called `--org` or `-o` for the organization and `--project` or `-p` for the project.

Note that they do not always go to the same command. For instance if you are managing releases (which are shared across the organization) you usually supply the organization to the `releases` command but the projects to the subcommand on it:

```bash
$ sentry-cli releases -o my-org new -p my-project 1.0
```

For more information use the `help` command which will display documentation for all parameters.

---
title: 'Command Line Usage'
sidebar_order: 4
---

Sentry installs a command line script under the name `sentry`. This will allow you to perform most required operations that are unachievable within the web UI.

If you’re using a non-standard configuration location make sure you to pass the configuration via the `SENTRY_CONF` environment variable:

```bash
SENTRY_CONF=/etc/sentry sentry help
```

For a list of commands, you can also use `sentry help`, or `sentry [command] --help` for help on a specific command.

## _sentry_

Sentry is cross-platform crash reporting built with love.

The configuration file is looked up in the _~/.sentry_ config directory but this can be overridden with the _SENTRY_CONF_ environment variable or be explicitly provided through the _–config_ parameter.

### Options

-   `--config PATH`: Path to configuration files.
-   `--version`: Show the version and exit.
-   `--help`: print this help page.

### Subcommands

-   [files]({%- link _documentation/server/cli/files/index.md -%})
-   [plugins]({%- link _documentation/server/cli/plugins/index.md -%})
-   [upgrade]({%- link _documentation/server/cli/upgrade/index.md -%})
-   [run]({%- link _documentation/server/cli/run/index.md -%})
-   [help]({%- link _documentation/server/cli/help/index.md -%})
-   [queues]({%- link _documentation/server/cli/queues/index.md -%})
-   [exec]({%- link _documentation/server/cli/exec/index.md -%})
-   [devserver]({%- link _documentation/server/cli/devserver/index.md -%})
-   [repair]({%- link _documentation/server/cli/repair/index.md -%})
-   [django]({%- link _documentation/server/cli/django/index.md -%})
-   [start]({%- link _documentation/server/cli/start/index.md -%})
-   [init]({%- link _documentation/server/cli/init/index.md -%})
-   [cleanup]({%- link _documentation/server/cli/cleanup/index.md -%})
-   [export]({%- link _documentation/server/cli/export/index.md -%})
-   [createuser]({%- link _documentation/server/cli/createuser/index.md -%})
-   [import]({%- link _documentation/server/cli/import/index.md -%})
-   [shell]({%- link _documentation/server/cli/shell/index.md -%})
-   [config]({%- link _documentation/server/cli/config/index.md -%})
-   [tsdb]({%- link _documentation/server/cli/tsdb/index.md -%})
-   [permissions]({%- link _documentation/server/cli/permissions/index.md -%})

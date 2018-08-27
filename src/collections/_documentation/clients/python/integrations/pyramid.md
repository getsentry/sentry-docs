---
title: Pyramid
sidebar_order: 11
---

## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```

## PasteDeploy Filter

A filter factory for [PasteDeploy](https://pastedeploy.readthedocs.io/en/latest/) exists to allow easily inserting Raven into a WSGI pipeline:

```ini
[pipeline:main]
pipeline =
 raven
 tm
 MyApp

[filter:raven]
use = egg:raven#raven
dsn = ___DSN___
include_paths = my.package, my.other.package
exclude_paths = my.package.crud
```

In the `[filter:raven]` section, you must specify the entry-point for raven with the `use =` key. All other raven client parameters can be included in this section as well.

See the [Pyramid PasteDeploy Configuration Documentation](http://docs.pylonsproject.org/projects/pyramid/en/latest/narr/paste.html) for more information.

## Logger setup

Add the following lines to your project’s _.ini_ file to setup _SentryHandler_:

```ini
[loggers]
keys = root, sentry

[handlers]
keys = console, sentry

[formatters]
keys = generic

[logger_root]
level = INFO
handlers = console, sentry

[logger_sentry]
level = WARN
handlers = console
qualname = sentry.errors
propagate = 0

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[handler_sentry]
class = raven.handlers.logging.SentryHandler
args = ('___DSN___',)
level = WARNING
formatter = generic

[formatter_generic]
format = %(asctime)s,%(msecs)03d %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

{% capture __alert_content -%}
You may want to setup other loggers as well. See the [Pyramid Logging Documentation](http://docs.pylonsproject.org/projects/pyramid/en/latest/narr/logging.html) for more information.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Instead of defining the DSN in the _.ini_ file you can also use the environment variable `SENTRY_DSN` which overwrites the setting in this file. Because of a syntax check you cannot remove the `args` setting completely, as workaround you can define an empty list of arguments `args = ()`.

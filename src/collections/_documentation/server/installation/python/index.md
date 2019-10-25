---
title: 'Installation with Python'
---

{% capture __alert_content -%}
This method of installation is deprecated in favor of [_Docker_]({%- link _documentation/server/installation/docker/index.md -%}).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

This guide will step you through setting up a Python-based virtualenv, installing the required packages, and configuring the basic web service.

## Dependencies

Some basic prerequisites which you’ll need in order to run Sentry:

-   A UNIX-based operating system. We test on Ubuntu and this documentation assumes an ubuntu based system.
-   Python 2.7
-   pip 8.1+
-   `python-setuptools`, `python-dev`, `libxslt1-dev`, `gcc`, `libffi-dev`, `libjpeg-dev`, `libxml2-dev`, `libxslt-dev`, `libyaml-dev`, `libpq-dev`

If you’re building from source you’ll also need:

-   Node.js 8.0 or newer.

## Setting up an Environment

The first thing you’ll need is the Python `virtualenv` package. You probably already have this, but if not, you can install it with:

```bash
pip install -U virtualenv
```

It’s also available as `python-virtualenv` on ubuntu in the package manager.

Once that’s done, choose a location for the environment, and create it with the `virtualenv` command. For our guide, we’re going to choose `/www/sentry/`:

```bash
virtualenv /www/sentry/
```

Finally, activate your virtualenv:

```bash
source /www/sentry/bin/activate
```

{% capture __alert_content -%}
Activating the environment adjusts your `PATH`, so that things like `pip` now install into the virtualenv by default.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

## Install Sentry

Once you’ve got the environment setup, you can install Sentry and all its dependencies with the same command you used to grab virtualenv:

```bash
pip install -U sentry
```

Don’t be worried by the amount of dependencies Sentry has. We have a philosophy of using the right tools for the job, and not reinventing them if they already exist.

Once everything’s installed, you should be able to execute the Sentry CLI, via `sentry`, and get something like the following:

```bash
$ sentry
Usage: sentry [OPTIONS] COMMAND [ARGS]...

  Sentry is cross-platform crash reporting built with love.

  The configuration file is looked up in the `~/.sentry` config directory but this can
  be overridden with the `SENTRY_CONF` environment variable or be explicitly provided
  through the `--config` parameter.

Options:
  --config PATH  Path to configuration files.
  --version      Show the version and exit.
  --help         Show this message and exit.

Commands:
  celery      DEPRECATED see `sentry run` instead.
  cleanup     Delete a portion of trailing data based on...
  config      Manage runtime config options.
  createuser  Create a new user.
  devserver   Starts a lightweight web server for...
  django      Execute Django subcommands.
  dsym        Manage system symbols in Sentry.
  export      Exports core metadata for the Sentry...
  files       Manage files from filestore.
  help        Show this message and exit.
  import      Imports data from a Sentry export.
  init        Initialize new configuration directory.
  plugins     Manage Sentry plugins.
  queues      Manage Sentry queues.
  repair      Attempt to repair any invalid data.
  run         Run a service.
  shell       Run a Python interactive interpreter.
  start       DEPRECATED see `sentry run` instead.
  tsdb        Tools for interacting with the time series...
  upgrade     Perform any pending database migrations and...
```

### Installing from Source

If you’re installing the Sentry source (e.g. from git), you’ll also need to install `npm`.

Once your system is prepared, symlink your source into the virtualenv:

```bash
$ pip install --editable .
```

This command will install npm dependencies as well as compile static assets.

You can also use pip to directly install the package from GitHub:

```bash
$ pip install -e git+https://github.com/getsentry/sentry.git@master#egg=sentry-dev
```

And more importantly, you can easily pin to a specific SHA:

```bash
$ pip install -e git+https://github.com/getsentry/sentry.git@___SHA___#egg=sentry-dev
```

## Initializing the Configuration

Now you’ll need to create the default configuration. To do this, you’ll use the `init` command You can specify an alternative configuration path as the argument to init, otherwise it will use the default of `~/.sentry`.

```bash
# the path is optional
sentry init /etc/sentry
```

Starting with 8.0.0, `init` now creates two files, `sentry.conf.py` and `config.yml`. To avoid confusion, `config.yml` will slowly be replacing `sentry.conf.py`, but right now, the uses of `config.yml` are limited.

The configuration inherits all of the server defaults, but you may need to change certain things, such as the database connection:

```python
# ~/.sentry/sentry.conf.py

# for more information on DATABASES, see the Django configuration at:
# https://docs.djangoproject.com/en/stable/ref/databases/
# This documentation refers to a newer Django version than what
# Sentry uses, so there may be some discrepancies.
DATABASES = {
    'default': {
        'ENGINE': 'sentry.db.postgres',
        'NAME': 'sentry',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}
```

## Configure Redis

Redis is used as the default implementation for various backend services, including the time-series storage, SQL update buffers, and rate limiting.

We recommend running two separate Redis clusters: one for persistent data (TSDB) and one for temporal data (buffers, rate limits). This is because you can configure the nodes in very different ones to enable more aggressive/optimized LRU.

That said, if you’re running a small install you can probably get away with just setting up the defaults in `config.yml`:

```yaml
redis.clusters:
  default:
    hosts:
      0:
        host: 127.0.0.1
        port: 6379
        # password: "my-secret-password"
```

All built-in Redis implementations (other than the queue) will use these default settings, but each individual service also will allow you to override it’s cluster settings by passing the name of the cluster to use as the `cluster` option.

Cluster options are passed directly to rb (a Redis routing library) as keyword arguments to the `Cluster` constructor. A more thorough discussion of the availabile configuration parameters can be found at the [rb GitHub repository](https://github.com/getsentry/rb).

See the individual documentation for [_the queue_]({%- link _documentation/server/queue.md -%}), [_update buffers_]({%- link _documentation/server/buffer.md -%}), [_quotas_]({%- link _documentation/server/throttling.md -%}), and [_time-series storage_]({%- link _documentation/server/tsdb.md -%}) for more details.

## Configure Outbound Mail

Initially, you will be prompted to supply these values during our Installation Wizard, but you may wish to explicitly declare them in your config file. For the standard implementation, using a simple SMTP server, you can simply configure the following in `config.yml`:

```yaml
mail.from: 'sentry@localhost'
mail.host: 'localhost'
mail.port: 25
mail.username: ''
mail.password: ''
mail.use-tls: false
```

Alternatively, if you want to disable email entirely, you could set:

```yaml
mail.backend: 'dummy'
```

## Running Migrations

Sentry provides an easy way to run migrations on the database on version upgrades. Before running it for the first time you’ll need to make sure you’ve created the database:

```bash
# If you kept the database ``NAME`` as ``sentry``
$ createdb -E utf-8 sentry
```

Once done, you can create the initial schema using the `upgrade` command:

```bash
$ SENTRY_CONF=/etc/sentry sentry upgrade
```

Next up you’ll need to create the first user, which will act as a superuser:

```bash
# create a new user
$ SENTRY_CONF=/etc/sentry sentry createuser
```

All schema changes and database upgrades are handled via the `upgrade` command, and this is the first thing you’ll want to run when upgrading to future versions of Sentry.

Internally this uses [South](https://south.readthedocs.io/en/latest/index.html) to manage database migrations.

## Starting the Web Service

Sentry provides a built-in webserver (powered by uWSGI) to get you off the ground quickly.

To start the built-in webserver run `sentry run web`:

```bash
SENTRY_CONF=/etc/sentry sentry run web
```

You should now be able to test the web service by visiting _http://localhost:9000/_.

## Starting Background Workers

A large amount of Sentry’s work is managed via background workers. These need run in addition to the web service workers:

```bash
SENTRY_CONF=/etc/sentry sentry run worker
```

See [_Asynchronous Workers_]({%- link _documentation/server/queue.md -%}) for more details on configuring workers.

[Celery](http://celeryproject.org/) is an open source task framework for Python.

## Starting the Cron Process

Sentry also needs a cron process:

```bash
SENTRY_CONF=/etc/sentry sentry run cron
```

It’s recommended to only run one of them at the time or you will see unnecessary extra tasks being pushed onto the queues but the system will still behave as intended if multiple beat processes are run. This can be used to achieve high availability.

## Setup a Reverse Proxy

By default, Sentry runs on port 9000. Even if you change this, under normal conditions you won’t be able to bind to port 80. To get around this (and to avoid running Sentry as a privileged user, which you shouldn’t), we recommend you setup a simple web proxy.

### Proxying with Nginx

You’ll use the builtin HttpProxyModule within Nginx to handle proxying:

```nginx
location / {
  proxy_pass         http://localhost:9000;
  proxy_redirect     off;

  proxy_set_header   Host              $host;
  proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
  proxy_set_header   X-Forwarded-Proto $scheme;
}
```

See [_Deploying Sentry with Nginx_]({%- link _documentation/server/nginx.md -%}) for more details on using Nginx.

### Enabling SSL

If you are planning to use SSL, you will also need to ensure that you’ve enabled detection within the reverse proxy (see the instructions above), as well as within the Sentry configuration:

```python
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## Running Sentry as a Service

We recommend using whatever software you are most familiar with for managing Sentry processes. For us, that software of choice is [Supervisor](http://supervisord.org/).

For Debian, Ubuntu and other operating systems relying on `systemd`, see that section.

### Configure `supervisord`

Configuring Supervisor couldn’t be more simple. Just point it to the `sentry` executable in your virtualenv’s bin/ folder and you’re good to go.

```
[program:sentry-web]
directory=/www/sentry/
environment=SENTRY_CONF="/etc/sentry"
command=/www/sentry/bin/sentry run web
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=syslog
stderr_logfile=syslog

[program:sentry-worker]
directory=/www/sentry/
environment=SENTRY_CONF="/etc/sentry"
command=/www/sentry/bin/sentry run worker
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=syslog
stderr_logfile=syslog

[program:sentry-cron]
directory=/www/sentry/
environment=SENTRY_CONF="/etc/sentry"
command=/www/sentry/bin/sentry run cron
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=syslog
stderr_logfile=syslog
```

### Configure `systemd`

Configuring systemd requires three files, one for each service. On Ubuntu 16.04, the files are located in `/etc/systemd/system`. Create three files named `sentry-web.service`, `sentry-worker.service` and `sentry-cron.service` with the contents listed below.

To ensure that the services start up on reboots, run the following command: `systemctl enable sentry-web.service`.

**sentry-web.service**

```
[Unit]
Description=Sentry Main Service
After=network.target
Requires=sentry-worker.service
Requires=sentry-cron.service

[Service]
Type=simple
User=sentry
Group=sentry
WorkingDirectory=/www/sentry
Environment=SENTRY_CONF=/etc/sentry
ExecStart=/www/sentry/bin/sentry run web

[Install]
WantedBy=multi-user.target
```

**sentry-worker.service**

```
[Unit]
Description=Sentry Background Worker
After=network.target

[Service]
Type=simple
User=sentry
Group=sentry
WorkingDirectory=/www/sentry
Environment=SENTRY_CONF=/etc/sentry
ExecStart=/www/sentry/bin/sentry run worker

[Install]
WantedBy=multi-user.target
```

**sentry-cron.service**

```
[Unit]
Description=Sentry Beat Service
After=network.target

[Service]
Type=simple
User=sentry
Group=sentry
WorkingDirectory=/www/sentry
Environment=SENTRY_CONF=/etc/sentry
ExecStart=/www/sentry/bin/sentry run cron

[Install]
WantedBy=multi-user.target
```

## Removing Old Data

One of the most important things you’re going to need to be aware of is storage costs. You’ll want to setup a cron job that runs to automatically trim stale data. This won’t guarantee space is reclaimed (i.e. by SQL), but it will try to minimize the footprint. This task is designed to run under various environments so it doesn’t delete things in the most optimal way possible, but as long as you run it routinely (i.e. daily) you should be fine.

```bash
$ crontab -e
0 3 * * * sentry cleanup --days=30
```

## What’s Next? {#what-s-next}

At this point you should have a fully functional installation of Sentry. You may want to explore [_various plugins_]({%- link _documentation/server/plugins.md -%}) available.

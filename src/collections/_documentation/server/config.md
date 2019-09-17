---
title: 'Configuring Sentry'
sidebar_order: 2
---

This document describes additional configuration options available to the Sentry server itself.

## First Install

During a new install, you will be prompted first for a walkthrough of the Installation Wizard. This wizard will help you get a few essential configuration options taken care of before beginning. Once done, you will be left with two files:

`config.yml`

: The YAML configuration was introduced in Sentry 8 and will allow you to configure various core attributes. Over time this will be expanded.

`sentry.conf.py`

: The Python file will be loaded once all other configuration is referenced, and allows you to configure various server settings as well as more complex tuning.

Many settings available in `config.yml` will also be able to be configured in the Sentry UI. Declaring them in the file will generally override the dynamically configured value and prevent it from being changed in the UI. These same settings can also be configured via the `sentry config` CLI helper.

## General

`SENTRY_ENVIRONMENT`

: Declared in system environment.

  The environment name for this installation. This will also control defaults for things like `DEBUG`.

  ```bash
  SENTRY_ENVIRONMENT=production sentry ...
  ```

`system.admin-email`

: Declared in `config.yml`.

  The technical contact address for this installation. This will be reported to upstream to the Sentry team (as part of the Beacon), and will be the point of contact for critical updates and security notifications.

  ```yaml
  system.admin-email: 'admin@example.com'
  ```

`system.url-prefix`

: Declared in `config.yml`.

  The URL prefix in which Sentry is accessible. This will be used both for referencing URLs in the UI, as well as in outbound notifications.

  ```yaml
  system.url-prefix: 'https://sentry.example.com'
  ```

`system.secret-key`

: Declared in `config.yml`.

  A secret key used for session signing. If this becomes compromised it’s important to regenerate it as otherwise its much easier to hijack user sessions.

  ```yaml
  system.secret-key: 'a-really-long-secret-value'
  ```

  To generate a new value, we’ve provided a helper:

  > $ sentry config generate-secret-key

## Logging

Sentry logs to two major places — `stdout`, and its internal project. To disable logging to the internal project, add a logger whose only handler is `'console'` and disable propagating upwards.

  {% include components/alert.html
    content="Explained below are the CLI flag and environment variable. They override the root logger and anything in `LOGGING.overridable`. Be very careful with this in a production system, because the Celery logger can be extremely verbose when set to INFO or DEBUG."
    level="warning"
  %}

`-l/--loglevel`

: Declared on the command line.

  Sentry can override logger levels by providing the CLI with the `-l/--loglevel` flag.
  The value of this can be one of the [standard Python logging level strings](https://docs.python.org/2/library/logging.html#levels).

  ```shell
  sentry --loglevel=WARNING
  ```

`SENTRY_LOG_LEVEL`

: Declared in system environment.

  Sentry can override logger levels with the `SENTRY_LOG_LEVEL` environment variable.
  The value of this can be one of the [standard Python logging level strings](https://docs.python.org/2/library/logging.html#levels).

  ```shell
  SENTRY_LOG_LEVEL=WARNING sentry ...
  ```

`LOGGING`

: Declared in `sentry.conf.py`.

  You can modify or override the full logging configuration with this setting. Be careful not to remove or override important defaults. You can check [the default configuration](https://git.io/fjjna) for reference.
  
  ```python
  LOGGING['default_level'] = 'WARNING'
  ```

## Redis

`redis.clusters`

: Declared in `config.yml`.

  Describes the Redis clusters available to the Sentry server. These clusters may then be referenced by name by other internal services such as the cache, digests, and TSDB backends, among others.

  For example,

  ```yaml
  redis.clusters:
    default:  # cluster name
      hosts:  # connection options, passed to `rb.Cluster`
        0:
          host: redis-1.example.com
          port: 6379
        1:
          host: redis-2.example.com
          port: 6379
    other:
      hosts:
        0:
          host: redis-3.example.com
          port: 6379
  ```

## Mail

`mail.from`

: Declared in `config.yml`.

  The email address used for outbound email in the `From` header.

  Defaults to `root@localhost`. It’s highly recommended to change this value to ensure reliable email delivery.

`mail.host`

: Declared in `config.yml`.

  The hostname to connect to for SMTP connections.

  Defaults to `localhost`.

`mail.port`

: Declared in `config.yml`.

  The port to connect to for SMTP connections.

  Defaults to `25`.

`mail.username`

: Declared in `config.yml`.

  The username to use when authenticating with the SMTP server.

  Defaults to `(empty)`.

`mail.password`

: Declared in `config.yml`.

  The password to use when authenticating with the SMTP server.

  Defaults to `(empty)`.

`mail.use-tls`

: Declared in `config.yml`.

  Should Sentry use TLS when connecting to the SMTP server?

  Defaults to `false`.

`mail.list-namespace`

: Declared in `config.yml`.

  The mailing list namespace for emails sent by this Sentry server. This should be a domain you own (often the same domain as the domain part of the `mail.from` configuration parameter value) or `localhost`.

`mail.backend`

: Declared in `config.yml`.

  The backend to be used for email delivery. Options are `smtp`, `console`, and `dummy`.

  Defaults to `smtp`. Use `dummy` if you’d like to disable email delivery.

## Authentication

The following keys control the authentication support.

`SENTRY_FEATURES['auth:register']`

: Declared in `sentry.conf.py`.

  Should Sentry allow users to create new accounts?

  Defaults to `True` (can register).

  ```python
  SENTRY_FEATURES['auth:register'] = True
  ```

`SENTRY_PUBLIC`

: Declared in `sentry.conf.py`.

  Should Sentry make all data publicly accessible? This should **only** be used if you’re installing Sentry behind your company’s firewall.

  Users will still need to have an account to view any data.

  Defaults to `False`.

  ```python
  SENTRY_PUBLIC = True
  ```

`SENTRY_ALLOW_ORIGIN`

: Declared in `sentry.conf.py`.

  If provided, Sentry will set the Access-Control-Allow-Origin header to this value on /api/store/ responses. In addition, the Access-Control-Allow-Headers header will be set to ‘X-Sentry-Auth’. This allows JavaScript clients to submit cross-domain error reports.

  You can read more about these headers in the [Mozilla developer docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

  Defaults to `None` (don’t add the Access-Control headers)

  ```python
  SENTRY_ALLOW_ORIGIN = "http://foo.example"
  ```

## Web Server

The following settings are available for the built-in webserver:

`SENTRY_WEB_HOST`

: Declared in `sentry.conf.py`.

  The hostname which the webserver should bind to.

  Defaults to `localhost`.

  ```python
  SENTRY_WEB_HOST = '0.0.0.0'  # bind to all addresses
  ```

`SENTRY_WEB_PORT`

: Declared in `sentry.conf.py`.

  The port which the webserver should listen on.

  Defaults to `9000`.

  ```python
  SENTRY_WEB_PORT = 9000
  ```

`SENTRY_WEB_OPTIONS`

: Declared in `sentry.conf.py`.

  A dictionary of additional configuration options to pass to uwsgi.

  Defaults to `{}`.

  ```python
  SENTRY_WEB_OPTIONS = {
      'workers': 10,
      'buffer-size': 32768,
  }
  ```

Additionally, if you’re using SSL, you’ll want to configure the following settings in `sentry.conf.py`:

```python
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## SMTP Server {#config-smtp-server}

The following settings are available for the built-in SMTP mail server:

`SENTRY_SMTP_HOST`

: Declared in `sentry.conf.py`.

  The hostname which the smtp server should bind to.

  Defaults to `localhost`.

  ```python
  SENTRY_SMTP_HOST = '0.0.0.0'  # bind to all addresses
  ```

`SENTRY_SMTP_PORT`

: Declared in `sentry.conf.py`.

  The port which the smtp server should listen on.

  Defaults to `1025`.

  ```python
  SENTRY_SMTP_PORT = 1025
  ```

`SENTRY_SMTP_HOSTNAME`

: Declared in `sentry.conf.py`.

  The hostname which matches the server’s MX record.

  Defaults to `localhost`.

  ```python
  SENTRY_SMTP_HOSTNAME = 'reply.getsentry.com'
  ```

## Data Sampling

`SENTRY_SAMPLE_DATA`

: Declared in `sentry.conf.py`.

  Controls sampling of data.

  Defaults to `True`.

  If this is enabled, data will be sampled in a manner similar to the following:

  -   50 messages stores ~50 results
  -   1000 messages stores ~400 results
  -   10000 messages stores ~900 results
  -   100000 messages stores ~1800 results
  -   1000000 messages stores ~3600 results
  -   10000000 messages stores ~4500 results

  ```python
  SENTRY_SAMPLE_DATA = False
  ```

## Beacon

`SENTRY_BEACON`

: Declared in `sentry.conf.py`.

  Controls the [_Beacon_]({%- link _documentation/server/beacon.md -%}).

  ```python
  SENTRY_BEACON = True
  ```

## GitHub App Integration

`github-app.id`

: Declared in `config.yml`.

  Your GitHub App ID.
  
`github-app.name`

: Declared in `config.yml`.

  The name of your GitHub App.
  
`github-app.webhook-secret`

: Declared in `config.yml`.

  The secret used to verify GitHub App Webhook event.
  
`github-app.private-key`

: Declared in `config.yml`.

  Your app's private key.
  
  {% include components/alert.html
    content="Make sure to replace newlines them with `\n` to preserve them."
    level="warning"
  %}
  
`github-app.client-id`

: Declared in `config.yml`.

  Your GitHub App's Client ID.
  
`github-app.client-secret`

: Declared in `config.yml`.

  Your GitHub App's Client Secret.

---
title: 'System Warnings'
sidebar_order: 19
---

## Deprecated Settings

Beginning with Sentry 8.0 configuration settings have started migrating from the original `sentry.conf.py` over into a new format `config.yml`. We refer to the new format as `SENTRY_OPTIONS`.

For example, `SENTRY_OPTIONS["system.admin-email"]` means, put `system.admin-email` into `config.yml`.

In Sentry 8.3, we have begun deprecating some settings from the old `sentry.conf.py` and will soon be only accepting the new values from the new `config.yml` file.

Historically, `SENTRY_CONF` or `--config` was pointed directly to your `sentry.conf.py`, such as:

```python
$ SENTRY_CONF=/etc/sentry/sentry.conf.py sentry start
```

Now, `SENTRY_CONF` should be pointed to the parent directory that contains both the python file and the yaml file. `sentry init` will generate the right structure needed for the future.:

```python
$ SENTRY_CONF=/etc/sentry sentry run web
```

The following will be a simple mapping of old (`sentry.conf.py`) keys to new (`config.yml`). Old settings should be completely removed.

### General

`SENTRY_ADMIN_EMAIL`

: ```python
  system.admin-email: 'sentry@example.com'
  ```

`SENTRY_URL_PREFIX`

: ```python
  system.url-prefix: 'http://example.com'
  ```

`SENTRY_SYSTEM_MAX_EVENTS_PER_MINUTE`

: ```python
  system.rate-limit: 10
  ```

`SECRET_KEY`

: ```python
  system.secret-key: 'abc123'
  ```

### Mail

`EMAIL_BACKEND`

: ```python
  mail.backend: 'smtp'
  ```

`EMAIL_HOST`

: ```python
  mail.host: 'localhost'
  ```

`EMAIL_PORT`

: ```python
  mail.port: 25
  ```

`EMAIL_HOST_USER`

: ```python
  mail.username: 'sentry'
  ```

`EMAIL_HOST_PASSWORD`

: ```python
  mail.password: 'nobodywillguessthisone'
  ```

`EMAIL_USE_TLS`

: ```python
  mail.use-tls: true
  ```

`SERVER_EMAIL`

: ```python
  mail.from: 'sentry@example.com'
  ```

`EMAIL_SUBJECT_PREFIX`

: ```python
  mail.subject-prefix: '[Sentry] '
  ```

`SENTRY_ENABLE_EMAIL_REPLIES`

: ```python
  mail.enable-replies: true
  ```

`SENTRY_SMTP_HOSTNAME`

: ```python
  mail.reply-hostname: 'inbound.example.com'
  ```

`MAILGUN_API_KEY`

: ```python
  mail.mailgun-api-key: 'abc123'
  ```

### Redis

`SENTRY_REDIS_OPTIONS`

: ```python
  redis.clusters:
    default:  # cluster name; `default` replaces `SENTRY_REDIS_OPTIONS`
      hosts:  # options are passed as keyword arguments to `rb.Cluster`
        0:
          host: redis-1.example.com
          port: 6379
        1:
          host: redis-2.example.com
          port: 6379
  ```

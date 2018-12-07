---
title: Laravel
sidebar_order: 50
---

Laravel is supported via a native package, [sentry-laravel](https://github.com/getsentry/sentry-laravel).

## Laravel 5.x

Install the `sentry/sentry-laravel` package:

```sh
$ composer require sentry/sentry-laravel
```

If you're on Laravel 5.4 or earlier, you'll need to add the following to your `config/app.php` (for Laravel 5.5+ these will be auto-discovered by Laravel):

```php
'providers' => array(
    // ...
    Sentry\Laravel\ServiceProvider::class,
)

'aliases' => array(
    // ...
    'Sentry' => Sentry\Laravel\Facade::class,
)
```

Add Sentry reporting to `App/Exceptions/Handler.php`:


```php
public function report(Exception $exception)
{
    if (app()->bound('sentry') && $this->shouldReport($exception)) {
        app('sentry')->captureException($exception);
    }

    parent::report($exception);
}
```

Create the Sentry configuration file (`config/sentry.php`):


```sh
$ php artisan vendor:publish --provider="Sentry\SentryLaravel\SentryLaravelServiceProvider"
```

Add your DSN to ``.env``:

```sh
SENTRY_LARAVEL_DSN=___PUBLIC_DSN___
```

### User Feeback

To see how to show user feedback dialog see: [User Feedback]({% link _documentation/enriching-error-data/user-feedback.md %}?platform=laravel)

## Laravel 4.x

Install the `sentry/sentry-laravel` package:

Laravel 4.x is supported until version 0.8.x.

```sh
$ composer require "sentry/sentry-laravel:0.8.*"
```

Add the Sentry service provider and facade in `config/app.php`:

```php
'providers' => array(
    // ...
    'Sentry\SentryLaravel\SentryLaravelServiceProvider',
)

'aliases' => array(
    // ...
    'Sentry' => 'Sentry\SentryLaravel\SentryFacade',
)
```

Create the Sentry configuration file (`config/sentry.php`):

```bash
$ php artisan config:publish sentry/sentry-laravel
```

Add your DSN to ``config/sentry.php``:

```php
<?php

return array(
    'dsn' => '___PUBLIC_DSN___',

    // ...
);
```

If you wish to wire up Sentry anywhere outside of the standard error handlers, or
if you need to configure additional settings, you can access the Sentry instance
through `$app`:

```php
$app['sentry']->setRelease(Git::sha());
```

## Lumen 5.x

Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel
```

Register Sentry in `bootstrap/app.php`:

```php
$app->register('Sentry\SentryLaravel\SentryLumenServiceProvider');

# Sentry must be registered before routes are included
require __DIR__ . '/../app/Http/routes.php';
```

Add Sentry reporting to `app/Exceptions/Handler.php`:

```php
public function report(Exception $e)
{
    if (app()->bound('sentry') && $this->shouldReport($e)) {
        app('sentry')->captureException($e);
    }

    parent::report($e);
}
```

Create the Sentry configuration file (`config/sentry.php`):

```php
<?php

return array(
    'dsn' => '___PUBLIC_DSN___',

    // capture release as git sha
    // 'release' => trim(exec('git log --pretty="%h" -n1 HEAD')),
);
```

## Testing with Artisan

You can test your configuration using the provided `artisan` command:

```sh
$ php artisan sentry:test
[sentry] Client DSN discovered!
[sentry] Generating test event
[sentry] Sending test event
[sentry] Event sent: e6442bd7806444fc8b2710abce3599ac
```

## Laravel specific options

#### breadcrumbs.sql_bindings

Capture bindings on SQL queries.
Defaults to `true`.

```php
'breadcrumbs.sql_bindings' => false,
```

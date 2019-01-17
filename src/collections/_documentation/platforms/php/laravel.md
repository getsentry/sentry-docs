---
title: Laravel
sidebar_order: 50
---

Laravel is supported via a native package, [sentry-laravel](https://github.com/getsentry/sentry-laravel).

<!-- WIZARD -->
## Laravel 5.x

Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel:{% sdk_version sentry.php.laravel %} php-http/curl-client guzzlehttp/psr7
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
    if (app()->bound('sentry') && $this->shouldReport($exception)){
        app('sentry')->captureException($exception);
    }

    parent::report($exception);
}
```

Create the Sentry configuration file (`config/sentry.php`) with this command:

```sh
$ php artisan vendor:publish --provider="Sentry\Laravel\ServiceProvider"
```

Add your DSN to ``.env``:

```sh
SENTRY_LARAVEL_DSN=___PUBLIC_DSN___
```
<!-- ENDWIZARD -->

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
$ composer require sentry/sentry-laravel:{% sdk_version sentry.php.laravel %} php-http/curl-client guzzlehttp/psr7
```

Register Sentry in `bootstrap/app.php`:

```php
$app->register('Sentry\Laravel\LumenServiceProvider');

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

## Using Laravel 5.6 log channels

{% capture __alert_content -%}
If you're using log channels to log your exceptions and are also logging exceptions to Sentry in your exception handler (as you would have configured above) exceptions might end up twice in Sentry.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

To configure Sentry as a log channel add the following config to the `channels` section in `config/logging.php`: 

```php
'channels' => [
    // ...
    'sentry' => [
        'driver' => 'sentry',
    ],
],
```

After you configured the Sentry log channel you can configure your app to both log to a log file and to Sentry by modifying the log stack:

```php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        // Add the Sentry log channel to the stack
        'channels' => ['single', 'sentry'],
    ],
    //...
],
```

Optionally you can set the logging level and if events should bubble on the driver:

```php
'channels' => [
    // ...
    'sentry' => [
        'driver' => 'sentry',
        'level'  => null, // The minimum monolog logging level at which this handler will be triggered
                          // For example: `\Monolog\Logger::ERROR`
        'bubble' => true, // Whether the messages that are handled can bubble up the stack or not
    ],
],
```

### Naming you log channels

If you have multiple log channels you would like to filter on inside the Sentry interface you can add the `name` attribute to the log channel, 
it will show up in Sentry as the `logger` tag which is filterable.

For example:

```php
'channels' => [
    'my_stacked_channel' => [
        'driver' => 'stack',
        'channels' => ['single', 'sentry'],
        'name' => 'my-channel'
    ],
    //...
],
```

You're now able to log errors to your channel:

```php
\Log::channel('my_stacked_channel')->error('My error');
```

And Sentry's `logger` tag now has the channel's `name`. You can filter on the "my-channel" value.

## Resolve name conflicts with packages also called Sentry

To resolve this you will need to create your own service provider extending ours so we can prevent naming conflicts.

```php
<?php

namespace App\Support;

class SentryLaravelServiceProvider extends \Sentry\Laravel\ServiceProvider
{
    public static $abstract = 'sentry-laravel';
}
```

You can then add this service provider to the `config/app.php`.

```php
'providers' => array(
    // ...
    App\Support\SentryLaravelServiceProvider::class,
)
```

Optionally if you want to use the facade you also need to extend / create a new facade.

```php
<?php

namespace App\Support;

class SentryLaravelFacade extends \Sentry\Laravel\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'sentry-laravel';
    }
}
```

And add that facade to your `config/app.php`.

```php
'aliases' => array(
    // ...
    'SentryLaravel' => App\Support\SentryLaravelFacade::class,
)
```

After you added your own service provider, running `php artisan vendor:publish --provider="App\Support\SentryLaravelServiceProvider"` publishes the Sentry config file to your chosen name (in the example above `config/sentry-laravel.php`) preventing conflicts with a `config/sentry.php` config file that might be used by the other package.

If you followed the regular installation instructions above (you should), make sure you replace `app('sentry')` with `app('sentry-laravel')`.

The namespace `\App\Support` can be anything you want in the examples above.

{% capture __alert_content -%}
If you're on Laravel 5.5+ the Sentry package is probably auto-discovered by Laravel. To solve this, add or append to the `extra` section in your `composer.json` file and run composer update/install afterward.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

```json
"extra": {
    "laravel": {
        "dont-discover": ["sentry/sentry-laravel"]
    }
}
```
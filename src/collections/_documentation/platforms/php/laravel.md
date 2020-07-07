---
title: Laravel
sidebar_order: 50
---

Laravel is supported via a native package, [sentry-laravel](https://github.com/getsentry/sentry-laravel).

## Installation

### Laravel 5.x, 6.x & 7.x

{% wizard %}
Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel:{% sdk_version sentry.php.laravel %}
```

If you're on Laravel 5.5 or later the package will be auto-discovered. Otherwise you will need to manually configure it in your `config/app.php`.

{% wizard hide %}
```php
'providers' => array(
    // ...
    Sentry\Laravel\ServiceProvider::class,
),
'aliases' => array(
    // ...
    'Sentry' => Sentry\Laravel\Facade::class,
),
```
{% endwizard %}

Add Sentry reporting to `App/Exceptions/Handler.php`.

**For Laravel 7.x and later:**

```php
public function report(Throwable $exception)
{
    if (app()->bound('sentry') && $this->shouldReport($exception)) {
        app('sentry')->captureException($exception);
    }

    parent::report($exception);
}
```

**For Laravel 5.x and 6.x:**

```php
public function report(Exception $exception)
{
    if (app()->bound('sentry') && $this->shouldReport($exception)) {
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
You can easily verify that Sentry is capturing errors in your Laravel application by creating a debug route that will throw an exception:

```php
Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});
```

Visiting this route will trigger an exception that will be captured by Sentry.
{% endwizard %}

### Lumen 5.x & 6.x

Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel:{% sdk_version sentry.php.laravel %}
```

Register Sentry in `bootstrap/app.php`:

```php
$app->register('Sentry\Laravel\ServiceProvider');

# Sentry must be registered before routes are included
require __DIR__ . '/../app/Http/routes.php';
```

Add Sentry reporting to `app/Exceptions/Handler.php`:

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

```php
<?php

return array(
    'dsn' => '___PUBLIC_DSN___',

    // capture release as git sha
    // 'release' => trim(exec('git log --pretty="%h" -n1 HEAD')),
);
```

### Laravel 4.x

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
),
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

## Configuration

The configuration file should be placed in `config/sentry.php` here you can configure all the [options](/error-reporting/configuration/?platform=php) the PHP SDK supports and a few Laravel specific options documented below.

### Laravel specific options

The Laravel integration will create [breadcrumbs](/platforms/php/#breadcrumbs) for certain events occuring in the framework, the capture of this information can be configured using the following options:

```php
'breadcrumbs' => [
    // Capture Laravel logs. Defaults to `true`.
    'logs' => true,

    // Capture queue job information. Defaults to `true`.
    'queue_info' => true,

    // Capture SQL queries. Defaults to `true`.
    'sql_queries' => true,

    // Capture bindings (parameters) on SQL queries. Defaults to `false`.
    'sql_bindings' => false,
],
```

### Testing with Artisan

You can test your configuration using the provided `artisan` command:

```sh
$ php artisan sentry:test
[sentry] Client DSN discovered!
[sentry] Generating test event
[sentry] Sending test event
[sentry] Event sent: e6442bd7806444fc8b2710abce3599ac
```

### Local development

When Sentry is installed in your application it will also be active when you are developing.

If you don't want errors to be sent to Sentry when you are developing set the DSN value to `null`.

You can do this by not defining `SENTRY_LARAVEL_DSN` in your `.env` or define it as `SENTRY_LARAVEL_DSN=null`.

## Customization

### Decorating the client builder

Starting with version [`1.5.0`](https://github.com/getsentry/sentry-laravel/releases/tag/1.5.0) of [sentry-laravel](https://github.com/getsentry/sentry-laravel) you can customize how the PHP SDK client is built by modifying the client builder.

You might want to do this to for example replace the transport or change the serializer options used which can only be changed when building the client.

The snippet below must be placed in the `register` method of a service provider (for example your `AppServiceProvider`).

In this example we increase `maxDepth` to 5 in for the default serializer.

```php
use Sentry\Serializer\Serializer;
use Sentry\ClientBuilderInterface;

$this->app->extend(ClientBuilderInterface::class, function (ClientBuilderInterface $clientBuilder) {
    $clientBuilder->setSerializer(new Serializer($clientBuilder->getOptions(), 5));
    
    return $clientBuilder;
});
```

## Integration

### User Feedback

To see how to show user feedback dialog see: [User Feedback](/enriching-error-data/user-feedback/?platform=laravel).

### User Context

Starting with Laravel 5.3 we can automatically add the authenticated user id to the scope if [`send_default_pii`](/error-reporting/configuration/?platform=php#send-default-pii) option is set to `true` in your `config/sentry.php`.

The mechanism to add more user context to the scope will vary depending on which version of Laravel you're using, but the general approach is the same. Find a good entry point to your application in which the context you want to add is available, ideally early in the process.

In the following example, we'll use a middleware to add the user information if a user is logged in:

```php
namespace App\Http\Middleware;

use Closure;
use Sentry\State\Scope;

class SentryContext
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (auth()->check() && app()->bound('sentry')) {
            \Sentry\configureScope(function (Scope $scope): void {
                $scope->setUser([
                    'id' => auth()->user()->id,
                    'email' => auth()->user()->email,
                ]);
            });
        }

        return $next($request);
    }
}
```

### Log channels

{% capture __alert_content -%}
If you're using log channels to log your exceptions and are also logging exceptions to Sentry in your exception handler (as you would have configured above) exceptions might end up twice in Sentry.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

Starting with Laravel & Lumen 5.6 we can setup Sentry using log channels.

To configure Sentry as a log channel, add the following config to the `channels` section in `config/logging.php`: 

```php
'channels' => [
    // ...
    'sentry' => [
        'driver' => 'sentry',
    ],
],
```

After you configured the Sentry log channel, you can configure your app to both log to a log file and to Sentry by modifying the log stack:

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

Optionally, you can set the logging level and if events should bubble on the driver:

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

### Queue jobs

When you have defined a `failed` method on your job class ([documentation](https://laravel.com/docs/6.x/queues#cleaning-up-after-failed-jobs)) that failed method acts as if your job runs inside a `try {} catch (\Exception $e) {}` and this will prevent reporting exception causing the job to have failed to be reported to Sentry.

This could be what you want since your job sometimes fails because of an API that is not reachable or other expected failures. If you still want the exception to be reported to Sentry you can do the following in your `failed` method:

```php
/**
 * The job failed to process.
 *
 * @param \Exception $exception
 *
 * @return void
 */
public function failed(\Exception $exception)
{
    // Send user notification of failure, etc...
    
    if (app()->bound('sentry')) {
        app('sentry')->captureException($exception);
    }
}
``` 

#### Naming your log channels

If you have multiple log channels you would like to filter on inside the Sentry interface, you can add the `name` attribute to the log channel. 
It will show up in Sentry as the `logger` tag, which is filterable.

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

### Resolve name conflicts with packages also called Sentry

To resolve this, you'll need to create your own service provider extending ours so we can prevent naming conflicts.

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

Optionally, if you want to use the facade, you also need to extend/create a new facade.

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

After you've added your own service provider, running `php artisan vendor:publish --provider="App\Support\SentryLaravelServiceProvider"` publishes the Sentry config file to your chosen name (in the example above `config/sentry-laravel.php`) preventing conflicts with a `config/sentry.php` config file that might be used by the other package.

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

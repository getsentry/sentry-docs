---
title: Laravel
sidebar_order: 3
---

Laravel is supported via a native package, [sentry-laravel](https://github.com/getsentry/sentry-laravel).

<!-- WIZARD -->
## Laravel 5.x {#laravel-5-x}

Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel
```

If you’re on Laravel 5.4 or earlier, you’ll need to add the following to your `config/app.php` (for Laravel 5.5+ these will be auto-discovered by Laravel):

```php
'providers' => array(
    // ...
    Sentry\SentryLaravel\SentryLaravelServiceProvider::class,
)

'aliases' => array(
    // ...
    'Sentry' => Sentry\SentryLaravel\SentryFacade::class,
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

```bash
$ php artisan vendor:publish --provider="Sentry\SentryLaravel\SentryLaravelServiceProvider"
```

Add your DSN to `.env`:

```bash
SENTRY_LARAVEL_DSN=___PUBLIC_DSN___
```

Finally, if you wish to wire up User Feedback, you can do so by creating a custom error view in _resources/views/errors/500.blade.php_.

For Laravel 5 up to 5.4 you need to open up `App/Exceptions/Handler.php` and extend the `render` method to make sure the 500 error is rendered as a view correctly, in 5.5+ this step is not required anymore an you can skip ahead to the next one:

```php
<?php

use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    public function report(Exception $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            app('sentry')->captureException($exception);
        }

        parent::report($exception);
    }

    public function render($request, Exception $exception)
    {
        // Convert all non-http exceptions to a proper 500 http exception
        // if we don't do this exceptions are shown as a default template
        // instead of our own view in resources/views/errors/500.blade.php
        if ($this->shouldReport($exception) && !$this->isHttpException($exception) && !config('app.debug')) {
            $exception = new HttpException(500, 'Whoops!');
        }

        return parent::render($request, $exception);
    }
}
```

Next, create `resources/views/errors/500.blade.php`, and embed the feedback code:

```html
{% raw %}<div class="content">
    <div class="title">Something went wrong.</div>

    @if(app()->bound('sentry') && !empty(Sentry::getLastEventID()))
        <div class="subtitle">Error ID: {{ Sentry::getLastEventID() }}</div>

        <!-- Sentry JS SDK 2.1.+ required -->
        <script src="https://cdn.ravenjs.com/3.3.0/raven.min.js"></script>

        <script>
            Raven.showReportDialog({
                eventId: '{{ Sentry::getLastEventID() }}',
                // use the public DSN (dont include your secret!)
                dsn: '___PUBLIC_DSN___',
                user: {
                    'name': 'Jane Doe',
                    'email': 'jane.doe@example.com',
                }
            });
        </script>
    @endif
</div>{% endraw %}
```

That’s it!

## Laravel 4.x {#laravel-4-x}

Install the `sentry/sentry-laravel` package:

Laravel 4.x is supported until version 0.8.x.

```bash
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

```php
$ php artisan config:publish sentry/sentry-laravel
```

Add your DSN to `config/sentry.php`:

```php
<?php

return array(
    'dsn' => '___PUBLIC_DSN___',

    // ...
);
```

If you wish to wire up Sentry anywhere outside of the standard error handlers, or if you need to configure additional settings, you can access the Sentry instance through `$app`:

```php
$app['sentry']->setRelease(Git::sha());
```

## Lumen 5.x {#lumen-5-x}

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
<!-- ENDWIZARD -->
## Testing with Artisan

You can test your configuration using the provided `artisan` command:

```bash
$ php artisan sentry:test
[sentry] Client configuration:
-> server: https://sentry.io/api/3235/store/
-> project: 3235
-> public_key: e9ebbd88548a441288393c457ec90441
-> secret_key: 399aaee02d454e2ca91351f29bdc3a07
[sentry] Generating test event
[sentry] Sending test event with ID: 5256614438cf4e0798dc9688e9545d94
```

## Adding Context

The mechanism to add context will vary depending on which version of Laravel you’re using, but the general approach is the same. Find a good entry point to your application in which the context you want to add is available, ideally early in the process.

In the following example, we’ll use a middleware:

```php
namespace App\Http\Middleware;

use Closure;

class SentryContext
{
    /**
 * Handle an incoming request.
 *
 * @param  \Illuminate\Http\Request $request
 * @param  \Closure                 $next
 *
 * @return mixed
 */
    public function handle($request, Closure $next)
    {
        if (app()->bound('sentry')) {
            /** @var \Raven_Client $sentry */
            $sentry = app('sentry');

            // Add user context
            if (auth()->check()) {
                $sentry->user_context([...]);
            } else {
                $sentry->user_context(['id' => null]);
            }

            // Add tags context
            $sentry->tags_context([...]);
        }

        return $next($request);
    }
}
```

## Configuration

The following settings are available for the client:

`dsn`

: The DSN to authenticate with Sentry.

  ```php
  'dsn' => '___PUBLIC_DSN___',
  ```

`release`

: The version of your application (e.g. git SHA)

  ```php
  'release' => MyApp::getReleaseVersion(),
  ```

`breadcrumbs.sql_bindings`

: Capture bindings on SQL queries.

  Defaults to `true`.

  ```php
  'breadcrumbs.sql_bindings' => false,
  ```

`user_context`

: Capture user_context automatically.

  Defaults to `true`.

  ```php
  'user_context' => false,
  ```

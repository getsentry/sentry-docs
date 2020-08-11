---
name: Laravel
doc_link: https://docs.sentry.io/platforms/php/laravel/
support_level: production
type: framework
---
Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel
```

If you're on Laravel 5.5 or later the package will be auto-discovered. Otherwise you will need to manually configure it in your `config/app.php`.



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

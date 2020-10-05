---
name: Laravel
doc_link: https://docs.sentry.io/platforms/php/guides/laravel/
support_level: production
type: framework
---

Install the `sentry/sentry-laravel` package:

```bash
composer require sentry/sentry-laravel
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

Setup Sentry with this command:

```shell
php artisan sentry:publish --dsn=___PUBLIC_DSN___
```

It creates (`config/sentry.php`) and adds the `DSN` to your `.env` file.

You can easily verify that Sentry is capturing errors in your Laravel application by creating a debug route that will throw an exception:

```php
Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});
```

Visiting this route will trigger an exception that will be captured by Sentry.

**Monitor Performane**

Set `traces_sample_rate` to a value greater than `0.0` (`config/sentry.php`) after that, Performance Monitoring will be enabled.

```php
'traces_sample_rate' => 1.0 # be sure to lower this in production to prevent quota issues
```

or in the `.env` file:

```shell
SENTRY_TRACES_SAMPLE_RATE=1
```
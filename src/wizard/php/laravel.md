---
name: Laravel
doc_link: https://docs.sentry.io/platforms/php/guides/laravel/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

This guide is for Laravel 8+. We also provide instructions for [other versions](https://docs.sentry.io/platforms/php/guides/laravel/other-versions/) as well as [Lumen-specific instructions](https://docs.sentry.io/platforms/php/guides/laravel/other-versions/lumen/).

## Install

Install the `sentry/sentry-laravel` package:

```bash
composer require sentry/sentry-laravel
```

Enable capturing unhandled exception to report to Sentry by making the following change to your `App/Exceptions/Handler.php`:

```php {filename:App/Exceptions/Handler.php}
public function register()
{
    $this->reportable(function (Throwable $e) {
        if (app()->bound('sentry')) {
            app('sentry')->captureException($e);
        }
    });
}
```

Alternatively, you can configure Sentry in your [Laravel Log Channel](https://docs.sentry.io/platforms/php/guides/laravel/usage/#log-channels), allowing you to log `info` and `debug` as well.

## Configure

Configure the Sentry DSN with this command:

```shell
php artisan sentry:publish --dsn=___PUBLIC_DSN___
```

It creates the config file (`config/sentry.php`) and adds the `DSN` to your `.env` file.

```shell {filename:.env}
SENTRY_LARAVEL_DSN=___PUBLIC_DSN___
```

## Verify

### Verify With Artisan

You can test your configuration using the provided `sentry:test` artisan command:

```shell
php artisan sentry:test
```

### Verify With Code

You can verify that Sentry is capturing errors in your Laravel application by creating a route that will throw an exception:

```php {filename:routes/web.php}
Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});
```

Visiting this route will trigger an exception that will be captured by Sentry.

## Performance Monitoring

Set `traces_sample_rate` in `config/sentry.php` or `SENTRY_TRACES_SAMPLE_RATE` in your `.env` to a value greater than `0.0`. Setting a value greater than `0.0` will enable Performance Monitoring, `0` (the default) will disable Performance Monitoring.

```shell {filename:.env}
# Be sure to lower this value in production otherwise you could burn through your quota quickly.
SENTRY_TRACES_SAMPLE_RATE=1.0
```

The example configuration above will transmit 100% of captured traces. Be sure to lower this value in production or you could use up your quota quickly.

You can also be more granular with the sample rate by using the `traces_sampler` option. Learn more in [Using Sampling to Filter Transaction Events](https://docs.sentry.io/platforms/php/guides/laravel/configuration/filtering/#using-sampling-to-filter-transaction-events).

Performance data is transmitted using a new event type called "transactions", which you can learn about in [Distributed Tracing](https://docs.sentry.io/product/sentry-basics/tracing/distributed-tracing/#traces-transactions-and-spans).

## Local Development and Testing

When Sentry is installed in your application, it will also be active when you are developing or running tests.

You most likely don't want errors to be sent to Sentry when you are developing or running tests. To avoid this, set the DSN value to `null` to disable sending errors to Sentry.

You can also do this by not defining `SENTRY_LARAVEL_DSN` in your `.env` or by defining it as `SENTRY_LARAVEL_DSN=null`.

If you do leave Sentry enabled when developing or running tests, it's possible for it to have a negative effect on the performance of your application or test suite.

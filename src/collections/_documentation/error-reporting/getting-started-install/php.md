To install the SDK you will need to be using `Composer` in your project. To install
it please see the [docs](https://getcomposer.org/download/).

Sentry PHP is not tied to any specific library that sends HTTP messages. Instead,
it uses [Httplug](https://github.com/php-http/httplug) to let users choose whichever PSR-7 implementation and HTTP client
they want to use.

If you just want to get started quickly you should run the following command:

```bash
php composer.phar require sentry/sentry:{% sdk_version sentry.php %} php-http/curl-client guzzlehttp/psr7
```

This will install the library itself along with an HTTP client adapter that uses
cURL as transport method (provided by [Httplug](https://github.com/php-http/httplug) and a PSR-7 implementation
(provided by Guzzle). You do not have to use those packages if you do not want to.
The SDK does not care about which transport method you want to use because it's
an implementation detail of your application. You may use any package that provides
[php-http/async-client-implementation](https://packagist.org/providers/php-http/async-client-implementation) and [http-message-implementation](https://packagist.org/providers/psr/http-message-implementation).

If you want to use Guzzle as an underlying HTTP client, you just need to run the
following command to install the adapter and Guzzle itself:

```bash
php composer.phar require php-http/guzzle6-adapter
```

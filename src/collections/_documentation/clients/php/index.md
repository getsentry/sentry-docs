---
title: PHP
sidebar_order: 11
robots: noindex
---

The PHP SDK for Sentry supports PHP 5.3 and higher. It’s available as a BSD licensed Open Source library.

## Getting Started
Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
3.  [Configure it](#configure)

<!-- WIZARD installation -->
## Installation {#install}

There are various ways to install the PHP integration for Sentry. The recommended way is to use [Composer](http://getcomposer.org/):

```bash
$ composer require sentry/sentry "^1.0"
```

Alternatively you can manually install it:

1.  Download and extract the latest [sentry-php](https://github.com/getsentry/sentry-php/archive/master.zip) archive to your PHP project.
2.  Require the autoloader in your application:

    ```php
    require_once '/path/to/Raven/library/Raven/Autoloader.php';
    Raven_Autoloader::register();
    ```
<!-- ENDWIZARD -->

<!-- WIZARD configuration -->
## Configuration {#configure}

The most important part is the creation of the raven client. Create it once and reference it from anywhere you want to interface with Sentry:

```php
$client = new Raven_Client('___PUBLIC_DSN___');
```

Once you have the client you can either use it manually or enable the automatic error and exception capturing which is recommended:

```php
$error_handler = new Raven_ErrorHandler($client);
$error_handler->registerExceptionHandler();
$error_handler->registerErrorHandler();
$error_handler->registerShutdownFunction();
```
<!-- ENDWIZARD -->

## Adding Context

Much of the usefulness of Sentry comes from additional context data with the events. The PHP client makes this very convenient by providing methods to set thread local context data that is then submitted automatically with all events. For instance you can use the `user_context` method to add information about the current user:

```php
$client->user_context(array(
    'email' => $USER->getEmail()
));
```

For more information see [Providing Request Context](/clients/php/config/#sentry-php-request-context).

## Deep Dive

Want more? Have a look at the full documentation for more information.

-   [Usage](/clients/php/usage/)
-   [Configuration](/clients/php/config/)
-   [Integrations](/clients/php/integrations/)
    -   [Laravel](/clients/php/integrations/#laravel)
    -   [Monolog](/clients/php/integrations/#monolog)
    -   [Symfony](/clients/php/integrations/#symfony2)

Resources:

-   [Bug Tracker](http://github.com/getsentry/sentry-php/issues)
-   [GitHub Project](http://github.com/getsentry/sentry-php)

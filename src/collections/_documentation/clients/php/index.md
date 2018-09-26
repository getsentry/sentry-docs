---
title: PHP
sidebar_order: 11
sidebar_relocation: platforms
---

The PHP SDK for Sentry supports PHP 5.3 and higher. It’s available as a BSD licensed Open Source library.

<!-- WIZARD installation -->
## Installation

There are various ways to install the PHP integration for Sentry. The recommended way is to use [Composer](http://getcomposer.org/):

```bash
$ composer require "sentry/sentry"
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
## Configuration

The most important part is the creation of the raven client. Create it once and reference it from anywhere you want to interface with Sentry:

```php
$client = new Raven_Client('___PUBLIC_DSN___');
```

Once you have the client you can either use it manually or enable the automatic error and exception capturing which is recomended:

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

For more information see [Providing Request Context]({%- link _documentation/clients/php/config.md -%}#sentry-php-request-context).

## Deep Dive

Want more? Have a look at the full documentation for more information.

-   [Usage]({%- link _documentation/clients/php/usage.md -%})
-   [Configuration]({%- link _documentation/clients/php/config.md -%})
-   [Integrations]({%- link _documentation/clients/php/integrations/index.md -%})
    -   [Laravel]({%- link _documentation/clients/php/integrations/laravel.md -%})
    -   [Monolog]({%- link _documentation/clients/php/integrations/monolog.md -%})
    -   [Symfony]({%- link _documentation/clients/php/integrations/symfony2.md -%})

Resources:

-   [Bug Tracker](http://github.com/getsentry/sentry-php/issues)
-   [Github Project](http://github.com/getsentry/sentry-php)

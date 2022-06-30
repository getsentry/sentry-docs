---
name: PHP
doc_link: https://docs.sentry.io/platforms/php/
support_level: production
type: language
---

## Install

To install the PHP SDK, you need to be using Composer in your project. For more details about Composer, see the [Composer documentation](https://getcomposer.org/doc/).

```bash
composer require sentry/sdk
```

## Configure

To capture all errors, even the one during the startup of your application, you should initialize the Sentry PHP SDK as soon as possible.

```php
\Sentry\init(['dsn' => '___PUBLIC_DSN___' ]);
```

## Usage

In PHP you can either capture a caught exception or capture the last error with captureLastError.

```php
try {
    $this->functionFailsForSure();
} catch (\Throwable $exception) {
    \Sentry\captureException($exception);
}

// OR

\Sentry\captureLastError();
```

---
name: PHP
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=php
support_level: production
type: language
---

To install the SDK you will need to be using `composer` in your project. If you
are not already using Composer please see the [Composer documentation](https://getcomposer.org/download/).

```bash
composer require sentry/sdk
```

To capture all errors, even the one during the startup of your application, you should initialize the Sentry PHP SDK as soon as possible.

```php
Sentry\init(['dsn' => '___PUBLIC_DSN___' ]);
```

One way to verify your setup is by intentionally sending an event that breaks your application.

You can throw an exception in your PHP application:

```php
throw new Exception("My first Sentry error!");
```

To capture all errors, even the one during the startup of your application, you should initialize the Sentry PHP SDK as soon as possible.

```php
\Sentry\init(['dsn' => '___PUBLIC_DSN___' ]);
```

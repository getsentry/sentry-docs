```php
use Sentry\Breadcrumb;

\Sentry\init([
  'dsn' => '___PUBLIC_DSN___',
  'before_breadcrumb' => function (Breadcrumb $breadcrumb): ?Breadcrumb {
    return $breadcrumb;
  },
]);
```

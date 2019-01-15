```php
use Sentry\Breadcrumb;
use function Sentry\init;

init([
  'dsn' => '___PUBLIC_DSN___',
  'before_breadcrumb' => function (Breadcrumb $breadcrumb): ?Breadcrumb {
    return $breadcrumb;
  },
]);
```

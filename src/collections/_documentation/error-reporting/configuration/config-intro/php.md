Options are passed to the `init()` as an array:

```php
use function Sentry\init;

init([
  'dsn' => '___PUBLIC_DSN___',
  'max_breadcrumbs' => 50,
]);
```

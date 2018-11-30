

You should `init` the Sentry PHP SDK as soon as possible during your application start:

```php
use function Sentry\init;

init(['dsn' => '___PUBLIC_DSN___' ]);
```

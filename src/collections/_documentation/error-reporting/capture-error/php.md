In PHP you can either capture a caught exception or capture the last error with `captureLastError`.

```php
use function Sentry\captureException;

try {
    $this->functionFailsForSure();
} catch (\Throwable $exception) {
    captureException($exception);
}
```

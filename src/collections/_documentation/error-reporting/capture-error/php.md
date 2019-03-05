In PHP you can either capture a caught exception or capture the last error with `captureLastError`.

```php
try {
    $this->functionFailsForSure();
} catch (\Throwable $exception) {
    Sentry\captureException($exception);
}
```

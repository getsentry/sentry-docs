```php
Sentry\captureException(function (Sentry\State\Scope $scope): void {
  $scope->setLevel(Sentry\Severity::warning());
});
```
```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setLevel(Sentry\Severity::warning());
});
```

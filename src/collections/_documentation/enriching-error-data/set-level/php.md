```php
use Sentry\State\Scope;
use Sentry\Severity;

\Sentry\captureException(function (Scope $scope): void {
  $scope->setLevel(Severity::warning());
});
```
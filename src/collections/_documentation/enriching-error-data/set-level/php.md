```php
use Sentry\State\Scope;
use Sentry\Severity;
use function Sentry\configureScope;

configureScope(function (Scope $scope): void {
  $scope->setLevel(Severity::warning());
});
```
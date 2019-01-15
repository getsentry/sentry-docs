
```php
use Sentry\State\Scope;
use function Sentry\captureException;
use function Sentry\withScope;
use function Sentry\configureScope;

withScope(function (Scope $scope): void {
  $scope->setTag('my-tag', 'my value');
  $scope->setLevel(Severity::warning());
  // will be tagged with my-tag="my value"
  captureException(new \Throwable('my error'))
});

// will not be tagged with my-tag
captureException(new \Throwable('my other error'));
```
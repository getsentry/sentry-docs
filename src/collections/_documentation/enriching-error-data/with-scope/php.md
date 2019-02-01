
```php
use Sentry\State\Scope;

\Sentry\withScope(function (Scope $scope): void {
  $scope->setTag('my-tag', 'my value');
  $scope->setLevel(Severity::warning());
  // will be tagged with my-tag="my value"
  captureException(new \Throwable('my error'))
});

// will not be tagged with my-tag
\Sentry\captureException(new \Throwable('my other error'));
```
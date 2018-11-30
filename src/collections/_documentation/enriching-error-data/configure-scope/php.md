```php
use Sentry\State\Scope;
use function Sentry\configureScope;

configureScope(function (Scope $scope): void {
  $scope->setTag('my-tag', 'my value');
  $scope->setUser([
    'id' => '42',
    'email' => 'john.doe@example.com',
  ]);
});
```
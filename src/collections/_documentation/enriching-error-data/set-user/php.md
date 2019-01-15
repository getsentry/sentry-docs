```php
use Sentry\State\Scope;
use function Sentry\configureScope;

configureScope(function (Scope $scope): void {
  $scope->setUser(['email' => '{{ page.example_user_email }}']);
});
```
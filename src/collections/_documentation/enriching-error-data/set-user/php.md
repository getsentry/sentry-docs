```php
use Sentry\State\Scope;

\Sentry\configureScope(function (Scope $scope): void {
  $scope->setUser(['email' => '{{ page.example_user_email }}']);
});
```
```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setUser(['email' => '{{ page.example_user_email }}']);
});
```
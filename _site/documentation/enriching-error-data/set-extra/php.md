```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setExtra('{{ page.example_extra_key }}', '{{ page.example_extra_value }}');
});
```

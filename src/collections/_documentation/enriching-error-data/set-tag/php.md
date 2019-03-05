```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setTag('{{ page.example_tag_name }}', '{{ page.example_tag_value }}');
});
```
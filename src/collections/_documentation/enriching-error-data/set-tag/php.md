```php
use Sentry\State\Scope;

\Sentry\configureScope(function (Scope $scope): void {
  $scope->setTag('{{ page.example_tag_name }}', '{{ page.example_tag_value }}');
});
```
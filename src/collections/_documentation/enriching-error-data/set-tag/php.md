```php
use Sentry\State\Scope;
use function Sentry\configureScope;

configureScope(function (Scope $scope): void {
  $scope->setTag('{{ page.example_tag_name }}', '{{ page.example_tag_value }}');
});
```
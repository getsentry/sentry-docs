```php
use Sentry\State\Scope;
use function Sentry\configureScope;

configureScope(function (Scope $scope): void {
  $scope->setExtra('{{ page.example_extra_key }}', '{{ page.example_extra_value }}');
});
```
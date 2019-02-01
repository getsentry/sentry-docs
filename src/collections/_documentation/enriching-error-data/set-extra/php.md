```php
use Sentry\State\Scope;

\Sentry\captureException(function (Scope $scope): void {
  $scope->setExtra('{{ page.example_extra_key }}', '{{ page.example_extra_value }}');
});
```
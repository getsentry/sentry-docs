```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setExtra('{{ page.example_extra_key }}', '{{ page.example_extra_value }}');
  
  // to set multiple key-value pairs at once:
  $scope->setExtras([
    '{{ page.example_extra_key }}' => '{{ page.example_extra_value }}',
    '{{ page.example_extra_key2 }}' => '{{ page.example_extra_value2 }}'
  ]);
});
```

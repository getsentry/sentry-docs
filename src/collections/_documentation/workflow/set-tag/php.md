```php
Sentry\configureScope(function (Sentry\State\Scope $scope): void {
  $scope->setTag('{{ page.example_tag_name }}', '{{ page.example_tag_value }}');
  
  // to set multiple key-value pairs at once:
  $scope->setTags([
    '{{ page.example_tag_name }}' => '{{ page.example_tag_value }}',
    '{{ page.example_tag_name2 }}' => '{{ page.example_tag_value2 }}'
  ]);
});
```

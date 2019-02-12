```php
\Sentry\addBreadcrumb(new \Sentry\Breadcrumb(
  Breadcrumb::LEVEL_ERROR, 
  Breadcrumb::TYPE_ERROR, 
  'error_reporting', 
  'foo bar'
));
```

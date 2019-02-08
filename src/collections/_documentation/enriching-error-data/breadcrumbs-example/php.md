```php
use Sentry\Breadcrumb;

\Sentry\addBreadcrumb(new Breadcrumb(
  Breadcrumb::LEVEL_ERROR, 
  Breadcrumb::TYPE_ERROR, 
  'error_reporting', 
  'foo bar'
));
```

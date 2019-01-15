```php
use Sentry\Breadcrumb;
use function Sentry\addBreadcrumb;

addBreadcrumb(new Breadcrumb(
  Breadcrumb::LEVEL_ERROR, 
  Breadcrumb::TYPE_ERROR, 
  'error_reporting', 
  'foo bar'
));
```

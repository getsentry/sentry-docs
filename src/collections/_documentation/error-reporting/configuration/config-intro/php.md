Options are passed to the `init()` method as an array:

```php
use function Sentry\init;

init([
  'dsn' => '___PUBLIC_DSN___',
  'max_breadcrumbs' => 50,
]);
```

{% capture __alert %}
Some of options listed below that are marked as _not available_ may be available in another form; see [PHP specific documentation]({% link _documentation/workflow/releases.md %}).
{% endcapture %}

{% include components/alert.html
  title="Note"
  content=__alert
%}

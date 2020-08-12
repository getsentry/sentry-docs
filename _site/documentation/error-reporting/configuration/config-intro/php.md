Options are passed to the `init()` method as an array:

```php
Sentry\init([
  'dsn' => '___PUBLIC_DSN___',
  'max_breadcrumbs' => 50,
]);
```

{% capture __alert %}
Some of the options listed below that are marked as _not available_ may be available in another form; see [PHP specific documentation](/workflow/releases/).
{% endcapture %}

{% include components/alert.html
  title="Note"
  content=__alert
  level="info"
%}

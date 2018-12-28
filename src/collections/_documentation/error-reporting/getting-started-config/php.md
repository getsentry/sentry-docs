You need to first create a Raven client and initialize it with your project's DSN.

```php
$client = (new Raven_Client('___PUBLIC_DSN___'))->install();
```

{% wizard hide %}
{% include components/alert.html
  title="What's Raven?"
  content="Raven is the legacy name of Sentry's PHP SDK."
%}
{% endwizard %}
---
name: Symfony
doc_link: https://docs.sentry.io/platforms/php/guides/symfony/
support_level: production
type: framework
---

Install the `sentry/sentry-symfony` package:

```bash
composer require sentry/sentry-symfony
```

Add your DSN to `app/config/config.yml`:

```yaml
sentry:
  dsn: "___PUBLIC_DSN___"
```

If you're using the Symfony Flex plugin, you'll find this file already created for you; it will suggest using an environment variable to inject the DSN value securely.

If you are _not_ using Symfony Flex plugin, you will need to enable the bundle in `app/AppKernel.php`:

```php
<?php
class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            // ...

            new Sentry\SentryBundle\SentryBundle(),
        );

        // ...
    }

    // ...
}
```

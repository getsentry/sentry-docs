---
name: Symfony
doc_link: https://docs.sentry.io/platforms/php/symfony/
support_level: production
type: framework
---

<div class="alert alert-warning" role="alert"><h5 class="no_toc">New version</h5><div class="alert-body content-flush-bottom">
This documentation refers to the v3.0 of the bundle. This version supports the newest [Unified API client](/platforms/php/).

You can continue to use [the previous versions](/clients/php/integrations/#symfony-2) if you're still using Symfony 2.

</div>
</div>

## Installation

Install the `sentry/sentry-symfony` package:

```bash
$ composer require sentry/sentry-symfony
```

### Enabling the bundle

<div class="alert" role="alert"><div class="alert-body content-flush-bottom">If you're using the Symfony Flex plugin, you can skip this step; the Flex recipe will automatically enable the bundle.</div>
</div>

Enable the bundle in `app/AppKernel.php`:

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

### Setting up the DSN

Add your DSN to `app/config/config.yml`:

```yaml
sentry:
  dsn: "___PUBLIC_DSN___"
```

If you're using the Symfony Flex plugin, you'll find this file already created for you; it will suggest using an environment variable to inject the DSN value securely.

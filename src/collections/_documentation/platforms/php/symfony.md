---
title: Symfony
sidebar_order: 60
---

Symfony is supported via the [sentry-symfony](https://github.com/getsentry/sentry-symfony) package as a native bundle.

<!-- WIZARD -->
## Installation

### Via Composer

Install the `sentry/sentry-symfony` package:

```bash
$ composer require sentry/sentry-symfony:^3.0
```

### Enabling the bundle
{% include components/alert.html
  content="If you're using the Symfony Flex plugin, you can skip this step; the bundle will be automatically enabled by the Flex recipe."
%}
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

If you're using the Symfony Flex plugin, you'll find this file already created for you; it will suggest to use an environment variable to inject the DSN value securely.

<!-- ENDWIZARD -->

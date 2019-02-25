---
title: Symfony
sidebar_order: 60
---

Symfony is supported via the [sentry-symfony](https://github.com/getsentry/sentry-symfony) package as a native bundle.

<!-- WIZARD -->
{% capture markdown_content %}
This documentation refers to the v3.0 of the bundle which is currently under development. 
This version supports the newest [Unified API client]({%- link _documentation/platforms/php/index.md -%}).

A beta version will be tagged as soon as possible, in the meantime you can continue to use [the previous versions]({%- link _documentation/clients/php/integrations/symfony2.md %}). 
To know more about the progress of this version see [the relative milestone](https://github.com/getsentry/sentry-symfony/milestone/3) on the GitHub repo.
{% endcapture %}

{% include components/alert.html
  title="Under development"
  content=markdown_content
  level="warning"
%}

## Installation

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

## Customization

The Sentry 2.0 SDK uses the Unified API, hence it uses the concept of `Scope`s to hold information about the current 
state of the app, and attach it to any event that is reported. This bundle has two listeners (`RequestListener` and 
`ConsoleListener`) that add some easy default information. Those listeners normally are executed with a priority of `1`
to allow easier customization with custom listener, that by default run afterwards, with a lower priority of `0`.

Those listeners are `final` so not extendable, but you can look at those to know how to add more information to the 
current `Scope` and enrich you Sentry events.

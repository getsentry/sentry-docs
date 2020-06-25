---
title: Symfony
sidebar_order: 60
---

Symfony is supported via the [sentry-symfony](https://github.com/getsentry/sentry-symfony) package as a native bundle.

<!-- WIZARD -->
{% capture markdown_content %}
This documentation refers to the v3.0 of the bundle. This version supports the newest [Unified API client](/platforms/php/).

You can continue to use [the previous versions](/clients/php/integrations/#symfony-2) if you're still using Symfony 2.
{% endcapture %}

{% include components/alert.html
  title="New version"
  content=markdown_content
  level="warning"
%}

## Installation

Install the `sentry/sentry-symfony` package:

```bash
$ composer require sentry/sentry-symfony
```

### Enabling the bundle
{% include components/alert.html
  content="If you're using the Symfony Flex plugin, you can skip this step; the Flex recipe will automatically enable the bundle."
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

If you're using the Symfony Flex plugin, you'll find this file already created for you; it will suggest using an environment variable to inject the DSN value securely.

<!-- ENDWIZARD -->

## Customization

The [Sentry 2.0 SDK](/platforms/php/#php-specific-options) uses the 
[Unified API](https://develop.sentry.dev/sdk/unified-api/), hence it uses the concept of `Scope`s to 
hold information about the current state of the app, and attach it to any event that is reported. 
This bundle has three listeners (`RequestListener`, `SubRequestListener`, and `ConsoleListener`) that add some easy 
default information. Those listeners normally are executed with a priority of `1` to allow easier customization with 
custom listeners, that by default run afterward, with a lower priority of `0`.

Those listeners are `final` so not extendable, but you can look at those to know how to add more information to the 
current `Scope` and enrich you Sentry events.

## Configuration
This is an example of the bundle configuration with all the possible options and example values:

N.B. The `register_error_listener` and `monolog` configuration options are available since [sentry/sentry-symfony:^3.2.0](https://github.com/getsentry/sentry-symfony/releases/tag/3.2.0)

```yaml
sentry:
    dsn: '___PUBLIC_DSN___'
    register_error_listener: true
    monolog:
        error_handler:
            enabled: false
            level: DEBUG
            bubble: true
    options:
        attach_stacktrace: true 
        before_breadcrumb: '@sentry.callback.before_breadcrumb'
        before_send: '@sentry.callback.before_send'
        capture_silenced_errors: false
        context_lines: 5
        default_integrations: true 
        enable_compression: true
        environment: '%kernel.environment%'
        error_types: 'E_ALL & ~E_NOTICE'
        http_proxy: '10.0.0.12:3456'
        in_app_exclude:
          - '%kernel.cache_dir%'
          - '%kernel.project_dir%/vendor'
        integrations: 
          - '@sentry.integration.my_custom_integration'
        excluded_exceptions: 
          - 'My\Exceptions\IgnorableException'
        logger: 'php'
        max_breadcrumbs: 50 
        max_value_length: 2048
        prefixes:
          - '/local_dir/' 
        project_root: '%kernel.project_dir%'
        release: 'abcde12345'
        sample_rate: 1
        send_attempts: 3 
        send_default_pii: true 
        server_name: 'www.example.com'
        tags:
          tag1: 'value1'
          tag2: 'value2'
    listener_priorities:
        request: 1
        subrequest: 1
        console: 1
```
### DSN
The DSN option is the only required option: it sets the Sentry DSN, and so reports all events to the related project. If it's
left empty, it disables Sentry reporting. Because Sentry enables the bundle in all environments, it's recommended to 
disable it in the `test` and `dev` environments.

### Options
All the possibile configurations under the `options` key map directly to the correspondent options from the base SDK;
you can read more about those in the [Unified API configuration docs](/error-reporting/configuration/),
and on the [PHP specific SDK docs](/platforms/php/#php-specific-options).

Below you can find additional documentation that is specific to the bundle usage, or information about the sensible default
values that you can use in some cases.

#### before_breadcrumb and before_send
The `before_breadcrumb` and `before_send` options both accept a `callable`; thus, you cannot provide it directly through
 a YAML file; the bundle accepts a service reference (starting with `@`), which you can build in your DIC container.

#### environment
The `environment` option defaults to the same environment of your Symfony application (For example,`dev`, `test`, `prod`...).

#### in_app_exclude
The `in_app_exclude` option is used to mark files as non belonging to your app's source code in events' stack traces.
In this bundle it has two default values: 
 * `%kernel.cache_dir%`, to exclude Symfony's cache dir
 * `%kernel.project_dir%/vendor`, to exclude Composer's dependencies

#### project_root
The `project_root` options defaults to `%kernel.project_dir%`.

### Listener priorities
The `listener_priorities` options are used to change the priority at which the bundle's listener is called. They all default
to `1`, so they are called just before the default priority of `0`, at which you can easily add your custom listeners.

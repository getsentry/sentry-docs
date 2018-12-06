---
title: PHP
sidebar_order: 3
---

{% include learn-sdk.md platform="php" %}

The [Sentry PHP SDK](https://packagist.org/packages/sentry/sentry) provides
support for PHP 7.1 or later.

This documentation goes over some PHP specific things such as integrations to
frameworks.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks and
libraries.  They can be seen as plugins that extend the functionality of the Sentry SDK.  
Integrations are configured by a call to `init`.

### Framework Integrations

Framework integrations are opt-in integrations for large frameworks or libraries.  Currently
the following are supported:

* [Laravel]({% link _documentation/platforms/php/laravel.md %})
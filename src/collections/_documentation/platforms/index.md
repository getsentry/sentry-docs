---
title: Platforms
sidebar_order: 2
keywords: ["flutter"]
---

To report to Sentry you’ll need to use a language-specific SDK. The Sentry team builds and maintains these for most popular languages, but there’s also a large ecosystem supported by the community.

If your use-case is very specific, or not covered by Sentry, you'll find documentation on how to report events on your own using our [_SDK API_]({%- link _documentation/development/sdk-dev/index.md -%}).

## Languages

{% include platform_icon_links.html select="languages" %}

## Frameworks

{% include platform_icon_links.html select="frameworks" %}

## Community-supported SDKs

These SDKs are [maintained and supported](https://forum.sentry.io) by the Sentry community. While generally our community does a great job at responding to issues, it's important to understand that Sentry staff cannot help you with issues using a community-supported SDK

* [_C++_](https://github.com/nlohmann/crow)
* [_Clojure_](https://github.com/sethtrain/raven-clj#alternatives)
* [_Crystal_](https://github.com/Sija/raven.cr)
* [_Flutter_]({% link _documentation/platforms/flutter/index.md %})
* [_Grails_](https://github.com/agorapulse/grails-sentry)
* [_Kubernetes_](https://github.com/getsentry/sentry-kubernetes)
* [_Lua_](https://github.com/cloudflare/raven-lua)
* [_Nuxt_](https://github.com/nuxt-community/sentry-module)
* [_OCaml_](https://github.com/brendanlong/sentry-ocaml)
* [_Scrapy_](https://github.com/llonchj/scrapy-sentry)
* [_Terraform_](https://github.com/jianyuan/terraform-provider-sentry)
* [_Wordpress_](https://github.com/stayallive/wp-sentry)
* [_Zend_](https://github.com/cloud-solutions/zend-sentry)

## Other platforms

Some platforms have been phased out or have been replaced with new SDKs. For those legacy integrations head over to the [legacy clients]({% link _documentation/clients/index.md %}) page.

Your favorite language or framework still cannot be found? Then we encourage you to start a discussion about supporting it on our [community forum](https://forum.sentry.io).

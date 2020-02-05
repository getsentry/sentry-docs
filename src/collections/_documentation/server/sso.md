---
title: 'Single Sign-On'
sidebar_order: 8
---

SSO in Sentry is handled in one of two ways:

-   Via a middleware which handles an upstream proxy dictating the authenticated user
-   Via a third-party service which implements an authentication pipeline

This documentation describes the latter, which would cover things like Google Apps and GitHub.

## Installing a Provider

### Sentry >= 10

- **GitHub** is bundled with Sentry. Follow the [GitHub integration guide]({%- link _documentation/server/integrations/github/index.md -%}) and then install your GitHub app to your organization.

### Sentry >= 9.1

- **Google Auth** is bundled with Sentry. Set the following values in your `config.yml` file:

```yaml
auth-google.client-id: '<client id>'
auth-google.client-secret: '<client secret>'
```

## Custom Providers

At this time the API is considered unstable and subject to change. Things likely won’t change a lot, but there’s a few areas that need some clean up.

With that in mind, if you wish to build your own, take a look at the base [`Provider`](https://github.com/getsentry/sentry/blob/master/src/sentry/auth/provider.py) class as well as one of the reference implementations above.

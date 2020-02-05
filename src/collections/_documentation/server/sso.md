---
title: 'Single Sign-On'
sidebar_order: 8
---

SSO in Sentry is handled in one of two ways:

-   Via a middleware which handles an upstream proxy dictating the authenticated user
-   Via a third-party service which implements an authentication pipeline

This documentation describes the latter, which will cover topics like Google Apps and GitHub.

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

At this time, the API is considered unstable and subject to change. There won't be many changes, but a few areas need some cleanup.

With that in mind, if you wish to build your own, take a look at the base [`Provider`](https://github.com/getsentry/sentry/blob/master/src/sentry/auth/provider.py) class as well as one of the reference implementations above.

## Related feature flags and settings

SSO and advanced SSO settings such as SAML2 and rippling are enabled by default when using the [on-premise repository](https://github.com/getsentry/onpremise). If you ever need to change these, here are the settings you can change in `sentry.conf.py`:

```python
SENTRY_FEATURES['organizations:sso'] = True
SENTRY_FEATURES['organizations:sso-saml2'] = True
SENTRY_FEATURES['organizations:sso-rippling'] = True
```

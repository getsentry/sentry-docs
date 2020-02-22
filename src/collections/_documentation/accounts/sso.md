---
title: 'Single Sign-On (SSO)'
sidebar_order: 4
---

Single Sign-On (or SSO) allows you to manage your organization’s entire membership via a third-party provider.

## Preface

Before you get around to actually turning on SSO, you’ll want to keep in mind that once it’s activated, all existing users will need to link their account before they are able to continue using Sentry. Because of that we recommend coordinating with your team during off-peak hours. That said, it’s super quick to link accounts, so we don’t consider it a true hurdle.

{% capture __alert_content -%}
SSO is not available on free, trial or certain grandfathered plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

## Getting Started

With that out of the way, head on over to your organization home. You’ll see an “Auth” link in the sidebar if you have access to SSO. Start by hitting that, and then continue to the “Configure” link next to provider you wish to configure.

Additionally we’ll automatically send each pre-existing member an email with instructions on linking their account. This will happen automatically once SSO is successfully configured. Even if they dont click the link, the next time they try to hit any page within the organization we’ll require them to link their account (with the same auth flow you just went through).

## Default Membership

Every member who creates a new account via SSO will be given global organization access with a member role. This means that they can access events from any team, but they won’t be able to create new projects or administer current ones.

## Security

Our SSO implementation prioritizes security. We aggressively monitor linked accounts and will disable them within any reasonable sign that the account’s access may have been revoked. Generally this will be transparent to you, but if the provider is functioning in an unexpected way you may experience more frequent re-authorization requests.

## Providers

### Google Business App

Enabling the Google integration will ask you to authenticate against a Google Apps account. Once done, membership will be restricted to only members of the given Apps domain (i.e. `sentry.io`).

### GitHub Organizations

The GitHub integration will authenticate against all organizations, and once complete prompt you for the organization which you wish to restrict access by.

### SAML2 Identity Provider

Sentry provides [SAML2 based authentication](https://en.wikipedia.org/wiki/SAML_2.0) which may be configured manually using the generic SAML2 provider, or a specific provider which provides defaults specific to that identity provider.

Sentry supports the following SAML services:

- Identity and Service Provider initiated SSO
- Identity Provider initiated SLO (Single Logout)

Sentry’s Assertion Consumer Service uses the HTTP-POST bindings.

Sentry’s SAML endpoints are as follows, where the `{organization_slug}` is substituted for your organization slug:

<table class="table"><tbody valign="top"><tr><th>ACS:</th><td><code class="docutils literal">https://sentry.io/saml/acs/{organization_slug}/</code></td></tr><tr><th>SLS:</th><td><code class="docutils literal">https://sentry.io/saml/sls/{organization_slug}/</code></td></tr><tr><th>Metadata:</th><td><code class="docutils literal">https://sentry.io/saml/metadata/{organization_slug}/</code></td></tr></tbody></table>

{% capture __alert_content -%}
SAML2 SSO requires a Business or Enterprise Plan.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

#### OneLogin

In your OneLogin dashboard locate the Sentry app in the app catalog and add it to your organization.

As part of OneLogin SSO configuration, you must to provide the OneLogin identity provider issuer URL to Sentry. This URL is specific to your OneLogin account and can be found under the ‘SSO’ tab on the Sentry OneLogin application configuration page.

You may refer to the [OneLogin documentation](https://support.onelogin.com/hc/en-us/articles/115005181586-Configuring-SAML-for-Sentry) for more detailed setup instructions.

#### Okta

In your Okta admin dashboard locate the Sentry app in the Okta Application Network and add it to your organization.

As part of the Okta SSO configuration, you must provide the Okta Identity Provider metadata to Sentry. This URL can be located under the Sign-On Methods SAML2 settings panel, look for the ‘Identity Provider metadata’ link which can may right click and copy link address.

You may refer to the [Okta documentation](http://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-Sentry.html) for more detailed setup instructions.

#### Auth0

In your Auth0 dashboard locate the Sentry app under the SSO Integrations page and add it to your organization.

As part of the Auth0 SSO configuration, you must provide the Auth0 Identity Provider metadata to Sentry. This URL is available under the Tutorial tab of the Sentry SSO integration.

#### Rippling

In your Rippling admin dashboard locate the Sentry app in the list of suggested apps and select it.

When prompted with the Rippling Metadata URL, copy this into the Sentry Rippling provider configuration. You will have to complete the Rippling application configuration before completing the sentry provider configuration.

#### Custom SAML2 Integration

For other SAML2 SSO providers not listed above, Sentry provides  generic connectors for [SAML2 based authentication]({%- link _documentation/accounts/saml2.md -%}), which may be configured manually.

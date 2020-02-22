---
title: 'SAML2 Integration'
sidebar_order: 5
---

Sentry provides a generic auth provider for [SAML2 based authentication](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language), which allows Owners of a Sentry organization to manually configure any SAML2-enabled IdP system. Documented below are the general steps for integration.

{% capture __alert_content -%}
SAML2 SSO requires a Business or Enterprise Plan.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

# Setup

Sentry supports the following SAML services:

* Identity and Service Provider initiated SSO
* Identity Provider initiated SLO (Single Logout)

## 1. Register Sentry with IdP
Before connecting Sentry to the Identity Provider (IdP), it’s important to first register Sentry as an application on the IdP’s side. Sentry’s SAML endpoints are as follows, where the `{organization_slug}` is substituted for your organization slug:

<table class="table"><tbody valign="top"><tr><th>ACS:</th><td><code class="docutils literal">https://sentry.io/saml/acs/{organization_slug}/</code></td></tr><tr><th>SLS:</th><td><code class="docutils literal">https://sentry.io/saml/sls/{organization_slug}/</code></td></tr><tr><th>Metadata:</th><td><code class="docutils literal">https://sentry.io/saml/metadata/{organization_slug}/</code></td></tr></tbody></table>

**What are these three things?**
* `ACS` means *Assertion Consumer Service*, and is used for establishing a session based on rules made between your IdP and the service provider it is integrating with. _Please note: Sentry’s ACS endpoint uses HTTP-POST bindings_
* `SLS` stands for *Single Logout Service*, and is used to address logout requests from the IdP.
* `Metadata`, alternatively referred to as the `entityID`  in some systems, refers to the configuration data for an IdP or an SP. In this case, the Metadata endpoint in Sentry refers to your Sentry organization’s metadata on the Service Provider end.

When setting these values up on the IdP end, it’s important to remember that Sentry.io does not need to provide a signing certificate for the integration to work.

## 2. Register IdP with Sentry
There are three distinct methods for registering your IdP with Sentry.io: Metadata, XML, and data fields. Each method is broken down below, and will produce the same end result.

### Using Metadata URL
This method only requires a Metadata URL provided by the IdP platform. After it has been supplied, Sentry will automatically fetch the metadata it needs.

{% asset saml2-metadata-url.png %}

### Using Provider XML
For this method to work, an administrator needs to provide the contents of the IdP’s generated metadata file. Once the contents are pasted directly into the text field, Sentry will do the rest. _Sentry.io does not require a signing certificate._

{% asset saml2-provider-xml.png %}

Here’s an example of what the Metadata XML contents look like.

```
<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://www.okta.com/exkf25e40eapgLtXx0h7">
  <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>...</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://dev-517249.oktapreview.com/app/sentry/exkf25e40eapgLtXx0h7/sso/saml" />
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://dev-517249.oktapreview.com/app/sentry/exkf25e40eapgLtXx0h7/sso/saml" />
  </md:IDPSSODescriptor>
</md:EntityDescriptor>
```

### Using Provider Data
This registration method is the most involved, and requires matching up the data fields from an IdP. The easiest way to accomplish this is to look for the values in a metadata file such as the one provided above.

{% asset saml2-provider-data.png %}

Based on the XML file example above, the field values to plug in are as follows:

* `EntityID`
* `X509Certificate`
* `SingleSignOnService`

In this example, the `SingleLogoutService` isn’t provided by the IdP, and is treated as an optional value within Sentry.


## 3. Map IdP Attributes

{% include components/alert.html
  title="Note on field names"
  content="Metadata field names can vary from one provider to another. For example, Microsoft Azure AD refers to these very metadata fields as **Claims**, while Okta refers to them as **Attributes**. Similarly, one platform might use **user.email**, while another vendor uses **emailaddress**."
  level="warning"
%}

Here, the field values of Sentry members need to be matched up with the corresponding values for members in the IdP. The basic required fields are the IdP's User ID and email address, but Sentry can also optionally pull first and last name values from there as well.

{% asset saml2-map-attributes.png %}



## 4. Confirm successful registration
Once the SAML integration flow is complete, the related Auth page will reflect the status of a successful integration. From here, you can send reminders to any existing members who existed prior to the integration, and they will receive an email prompt to link their accounts.

{% asset saml2-success.png %}

Because Sentry uses Just-In-Time (JIT) provisioning, new members are registered with Sentry automatically during their first login attempt with SAML SSO. These accounts will have their membership types delegated based on what the default membership role is in your Organization Settings in Sentry.

# Frequently Asked Questions

**What is the process for adding new members to a SAML2-enabled Sentry organization?**  
Sentry makes use of Just-In-Time provisioning for member accounts; any new member created within an Identity Provider will have an account automatically created in Sentry when that member attempts to sign into Sentry for the first time.  

**What happens to Sentry.io accounts that exist prior to SAML being enabled/enforced?**  
Existing members will receive an email notifying them of the new SAML authentication option once it is turned on (regardless of enforcement) and they'll be able to link the accounts in the IdP system with their Sentry memberships.  

**Does Sentry deprovision members if they are no longer present in the Identity Provider?**  
At this time, Sentry's SAML2 integration does not automatically deprovision inactive user accounts.
Instead, the member remains inside of Sentry.io without any means to log in, as they can no longer access the IdP platform for sign-on. For now, inactive member accounts will need to be removed manually by a Manager or an Owner in Sentry.

**Attempting to set up SAML2 SSO with an IdP results in a failure with the message “The provider did not return a valid user identity.” What is happening here?**  
The crux of the problem here is that different IdP platforms (Okta, Azure AD, etc) use different terms and conventions for the fields necessary for the integration to work. As a result, it’s possible to map up incorrect values into Sentry, causing SSO to fail with this error message.  

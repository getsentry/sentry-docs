---
title: 'Custom SAML2 SSO'
sidebar_order: 5
---

Sentry provides a generic auth provider for SAML2 based authentication, which allows Owners of a Sentry organization to manually configure any SAML2-enabled IdP system. Documented below are the general steps for integration.

{% capture __alert_content -%}
SAML2 SSO is not available on free, trial or certain grandfathered plans.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

# Setup

## 1. Register Sentry with IdP
Before connecting Sentry to the Identity Provider (IdP), it’s important to first register Sentry as an application on the IdP’s side. Sentry’s SAML endpoints are as follows, where the `{organization_slug}` is substituted for your organization slug:

**What are these three things?**
* `ACS` means *Assertion Consumer Service*, and is used for establishing a session based on rules made between your IdP and the service provider it is integrating with. Please note: Sentry’s ACS endpoint uses HTTP-POST bindings
* `SLS` stands for *Single Logout Service*, and is used to address logout requests from the IdP.
* `Metadata`, alternatively referred to as the `entityID`  in some systems, refers to the configuration data for an IdP or an SP. In this case, the Metadata endpoint in Sentry refers to your Sentry organization’s metadata on the Service Provider end.

When setting these values up on the IdP end, it’s important to remember that Sentry.io does not need to provide a signing certificate for the integration to work.

## 2. Register IdP with Sentry
There are three distinct methods for registering your IdP with Sentry.io: Metadata, XML, and data fields. Each method is broken down below, and will produce the same end result.

### Using Metadata URL
This method only requires a Metadata URL provided by the IdP platform. After it has been supplied, Sentry will automatically fetch the metadata it needs.

[screenshot]

### Using Provider XML
For this method to work, an administrator needs to provide the contents of the IdP’s generated metadata file. Once the contents are pasted directly into the text field, Sentry will do the rest. Note that Sentry.io does not require a signing certificate.

[screenshot]

Here’s an example of what the Metadata XML contents look like.

```

<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://www.okta.com/exkf25e40eapgLtXx0h7">
<md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
<md:KeyDescriptor use="signing">
<ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
<ds:X509Data>
<ds:X509Certificate>
MIIDpDCCAoygAwIBAgIGAV3jWPYbMA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU MBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi01MTcyNDkxHDAaBgkqhkiG9w0BCQEW DWluZm9Ab2t0YS5jb20wHhcNMTcwODE1MDA0MzA0WhcNMjcwODE1MDA0NDAzWjCBkjELMAkGA1UE BhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNV BAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtNTE3MjQ5MRwwGgYJ KoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA o7OQ51PQdel7doiZ4tXRBGoB+6TgUZLqA0JGMcRCBsS6ApMaxho7kc+urC3I6CrL4pw4Dw6RGXY4 bENVbhAJo46U1kN2QYnnyV/e+GqJgKQK4qGllS2dfGsMeiyj9QXocP+h13VNeeHb0xBAo7qZTGxW aNn16+OGuw02JQY5F7MRT0UKNNVnuXjp3z8NdUHqoxMmdo0TTgOXb9BgmgYSxkRn6iBF0tG3tpig lUt2CJUKsLPgq/dSMlce+XUIwdDErebfqtB3dQ9O7iIp5ZpynPUkcEMmjMznK/pptHzvoUY8sWBN XJcqEsXT83RTNTdoo0zpUDjaWMVH/su6seGDqwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCOqhYY w8cmqvJyihgY8Ir50Zg6EQqlLS0whNuUOgQDHEMxSbkC+/dfuOSIeS9Ps/7sg5J4wcDs/enrKOMS BD3r9jH7E6KNEoleRv8AWRXlwQnIOajPQKFSTUQDF5Z/aDPc4SvrAQvXE+KggviwA80xxyGDf64L qYeCG3WiShHgBOVIpXuItSQTRZFjIvZRDJyawXpYfuSj2jxNdg+ChuhF4+baHfKwYvP6Z6YuoQvM aRjS00xKN7h4Pq1KtCfxyQC+WobCErYojEasRS/JUS4cCAkwtUKcha63HIayTCdgrfaKW9aEwACk IXWNkhXDx03WbSxgxRMidkA1eADs30r1
</ds:X509Certificate>
</ds:X509Data>
</ds:KeyInfo>
</md:KeyDescriptor>
<md:NameIDFormat>
urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
</md:NameIDFormat>
<md:NameIDFormat>
urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
</md:NameIDFormat>
<md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://dev-517249.oktapreview.com/app/sentry/exkf25e40eapgLtXx0h7/sso/saml"/>
<md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://dev-517249.oktapreview.com/app/sentry/exkf25e40eapgLtXx0h7/sso/saml"/>
</md:IDPSSODescriptor>
</md:EntityDescriptor>
```

### Using Provider Data
This registration method is the most involved, and requires matching up the data fields from an IdP. The easiest way to accomplish this is to look for the values in a metadata file such as the one provided above.

[screenshot]

Based on the XML file example above, the field values to plug in are as follows:

* `EntityID`
* `X509Certificate`
* `SingleSignOnService`

In this example, the `SingleLogoutService` isn’t provided by the IdP, and is treated as an optional value within Sentry.


## 3. Map IdP Attributes
All you need to do here is match up the specific membership fields with the corresponding values found in your IdP platform documentation.

[screenshot]

One word of caution: metadata field names can vary from one provider to another. For example, Microsoft Azure AD refers to these very metadata fields as Claims, while Okta refers to them as Attributes. Similarly, one platform might use user.email, while another vendor uses emailaddress

## 4. Confirm successful registration
Once the SAML integration flow is complete, the related Auth page will reflect the status of a successful integration. From here, you can send reminders to any existing members who existed prior to the integration, and they will receive an email prompt to link their accounts.

[screenshot]

Because Sentry uses Just-In-Time (JIT) provisioning, new members are registered with Sentry automatically during their first login attempt with SAML SSO. These accounts will have their membership types delegated based on what the default membership role is in your Organization Settings in Sentry.

# Troubleshooting

**What happens to Sentry.io accounts that exist prior to SAML being enabled/enforced?**  
Existing members will receive an email notifying them of the new SAML authentication option once it is turn it on (regardless of enforcement) and they'll be able to link the accounts in the IdP system with their Sentry memberships.

**Attempting to set up SAML2 SSO with an IdP results in a failure with the message “The provider did not return a valid user identity”?**  
The crux of the problem here is that different IdP platforms (Okta, Azure AD, etc) use different terms for the fields necessary for the integration to work. As a result, it’s possible to map up incorrect values into Sentry, causing SSO to fail with this error message.

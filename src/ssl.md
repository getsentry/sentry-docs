---
title: SSL
---

Sentry uses SSL for submission of events if available. This works slightly different depending on the version of Sentry you are using. For the most part we are trying to make the handling of SSL as transparent as possible, but this cannot be guaranteed in all cases.

## Certificates

Due to the complexities of root CAs and distributions, you may find that your SDK does not contain the root certificate authority used by sentry.io. While we bundle this in official Sentry SDKs, that’s not true for everything.

Our CA is DigiCert, a widely trusted name. Below you’ll find our public key, along with DigiCert’s intermediate and root CAs:

Certificates:

-   [getsentry.crt](https://sentry.io/_static/getsentry/ssl/getsentry.crt)
-   [DigiCertCA.crt](https://sentry.io/_static/getsentry/ssl/DigiCertCA.crt)
-   [TrustedRoot.crt](https://sentry.io/_static/getsentry/ssl/TrustedRoot.crt)

Bundles:

-   [getsentry.pem](https://sentry.io/_static/getsentry/ssl/getsentry.pem)
-   [getsentry.p7b](https://sentry.io/_static/getsentry/ssl/getsentry.p7b)

Using this varies from case to case. Many SDKs you will have to explicit specify the path to the certificate bundle. Covering this is outside of the scope of these docs, so we suggest referring to your specific SDK’s documentation.

Note on Java:

Certain versions of the JRE already include the DigiCert certificates, but if yours doesn’t, you should be able to add our key to your root keystore using the Java keytool:

```bash
$ keytool -import -trustcacerts -file /path/to/getsentry.pem \
    -alias getsentry -keystore $JAVA_HOME/jre/lib/security/cacerts
```

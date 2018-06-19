Security Policy Reporting
=========================

Sentry provides the ability to collect information on `Content-Security-Policy (CSP)
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy>`_ violations,
as well as `Expect-CT <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT>`_
and `HTTP Public Key Pinning (HPKP) <https://developer.mozilla.org/en-US/docs/Web/HTTP/Public_Key_Pinning>`_
failures by setting the proper HTTP header which results in violation/failure to be sent to
Sentry endpoint specified in `report-uri`.

The integration process consists of configuring the the appropriate header with
your project key's Security Header endpoint found at
**Project Settings > Client Keys (DSN) > Expand**.

Content-Security-Policy
-----------------------

The `CSP <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy>`_
response header allows for control over resources can be loaded.

Configure the `Content-Security-Policy` header with relevant policies and report-uri.

For example, in Python this looks like the following::

    Content-Security-Policy: ...; report-uri https://sentry.io/api/<project>/csp-report/?sentry_key=<key>

Expect-CT
---------

The `Expect-CT <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT>`_
response header enables reporting and/or enforcemnt of Certification Transparency
requirements, which allows you to be notified of misissued certificates.

Configure the `Expect-CT` header with relevant policies and report-uri::

    Expect-CT: ..., report-uri="https://sentry.io/api/<project>/security/?sentry_key=<key>"

HTTP Public Key Pinning
-----------------------

`HTTP Public Key Pinning (HPKP) <https://developer.mozilla.org/en-US/docs/Web/HTTP/Public_Key_Pinning>`_
response header instructs a web client to associate a specific cryptographic public key with a
certain web server, in order to reduce the risk of MITM (man-in-the-middle) attacks.

Configure the `Public-Key-Pins` header with relevant policies and report-uri::

    Public-Key-Pins: ...; report-uri="https://sentry.io/api/<project>/security/?sentry_key=<key>"

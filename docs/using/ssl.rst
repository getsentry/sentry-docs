SSL
===

Sentry uses SSL for submission of events if available.  This works
slightly different depending on the version of Sentry you are using.  For
the most part we are trying to make the handling of SSL as transparent as
possible, but this cannot be guaranteed in all cases.

.. sentry:edition:: cloud

    Getsentry Certificates
    ----------------------

    Due to the complexities of root CAs and distributions, you may find
    that your client does not contain the root certificate authority used
    by getsentry.com.  While we bundle this in official raven clients,
    that's not true for everything.

    Our CA is DigiCert, a widely trusted name. Below you'll find our
    public key, along with DigiCert's intermediate and root CAs:

    Certificates:

    -   `getsentry.crt <https://www.getsentry.com/_static/getsentry/ssl/getsentry.crt>`_
    -   `DigiCertCA.crt <https://www.getsentry.com/_static/getsentry/ssl/DigiCertCA.crt>`_
    -   `TrustedRoot.crt <https://www.getsentry.com/_static/getsentry/ssl/TrustedRoot.crt>`_

    Bundles:

    -   `getsentry.pem <https://www.getsentry.com/_static/getsentry/ssl/getsentry.pem>`_
    -   `getsentry.p7b <https://www.getsentry.com/_static/getsentry/ssl/getsentry.p7b>`_

    Using this varies from case to case. Many clients you will have to
    explicit specify the path to the certificate bundle.  Covering this is
    outside of the scope of these docs, so we suggest referring to your
    specific client's documentation.

    Note on Java:

    Certain versions of the JRE already include the DigiCert certificates,
    but if yours doesn't, you should be able to add our key to your root
    keystore using the Java keytool::

        $ keytool -import -trustcacerts -file /path/to/getsentry.pem \
            -alias getsentry -keystore $JAVA_HOME/jre/lib/security/cacerts


.. sentry:edition:: enterprise, community

    Custom Certificates
    -------------------

    For Sentry Enterprise Edition as well as the Sentry Community Edition
    you will need to provide your own SSL certificate for encryption.
    There are no direct requirements for the certificates, you can also
    use self signing.  The clients are designed to allow supplying of
    custom certificates.

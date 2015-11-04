.. sentry:edition:: hosted, on-premise

    .. class:: platform-perl

    Perl
    ====

.. class:: sentry-support-block sentry-support-block-community

    The Perl SDK is maintained and supported by the Sentry community. Learn more about the project on `GitHub <https://github.com/rentrak/perl-raven>`_.

Installation
------------

``Sentry::Raven`` is distributed via `CPAN <https://metacpan.org/pod/Sentry::Raven>`_:

.. code-block:: shell

    cpanm Sentry::Raven


Configuring the Client
----------------------

Create a new instance of the client:


.. code-block:: perl

    my $sentry = Sentry::Raven->new( sentry_dsn => 'http://<publickey>:<secretkey>@app.getsentry.com/<projectid>' );


Reporting Errors
----------------

The easiest way to capture errors is to execute code within a block:

.. code-block:: perl

    # capture all errors
    $sentry->capture_errors( sub {
        ..do something here..
    } );


For more information, see the `CPAN documentation <https://metacpan.org/pod/Sentry::Raven>`_.

Resources
---------

* `Bug Tracker <https://github.com/rentrak/perl-raven/issues>`_
* `Github Project <https://github.com/rentrak/perl-raven>`_

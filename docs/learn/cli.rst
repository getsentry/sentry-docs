.. _sentry-cli:

Command Line Interface
======================

For certain actions you can use the ``sentry-cli`` command line
executable.  It can connect to the Sentry API and manage some data for
your projects.  Currently the tool is still very barebones and is
primarily used for managing debug symbols for the iOS integration.

Installation
------------

At present `sentry-cli` is only supported on OS X.  It can be installed
from a terminal with the following command::

    curl https://www.getsentry.com/get-cli | bash

It will automatically download the correct version of ``sentry-cli`` for
your operating system and install it.  If necessarily it will prompt for
your admin password for ``sudo``.

To verify it's installed correctly you can bring up the help::

    $ sentry-cli --help

.. sentry:edition:: on-premise

    Connecting To Your Installation
    -------------------------------

    By default ``sentry-cli`` will connect to app.getsentry.com.  For
    on-prem you need to either provide the ``--url`` parameter or you can
    export the ``SENTRY_URL`` parameter and point it to your
    installation::

        export SENTRY_URL=https://mysentry.invalid/

Authentication
--------------

To authenticate ``sentry-cli`` you can to your to your API keys settings
in your user account (User Icon -> API) and generate a new key.
Afterwards you can export the ``SENTRY_AUTH_TOKEN`` environment variable::

    export SENTRY_AUTH_TOKEN=your-auth-token

Alternatively you can provide the ``--auth-token`` command line parameter
whenever you invoke ``sentry-cli``.

Environment Variables
---------------------

Most parameters that can be supplied on the command line to the tool
itself or some of the commands within it, can also be supplied as
environment variables.  The following variables are known:

``SENTRY_ORG``:
    the slug of the organization to use for a command.
``SENTRY_PROJECT``:
    the slug of the project to use for a command.
``SENTRY_AUTH_TOKEN``:
    the authentication token to use for all communication with Sentry.
``SENTRY_URL``:
    The URL to use to connect to sentry.  This defaults to
    ``https://app.getsentry.com/``.

Updating and Uninstalling
-------------------------

You can use ``sentry-cli update`` and ``sentry-cli uninstall`` to update
or uninstall the sentry command line interface.

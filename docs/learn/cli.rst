.. _sentry-cli:

Command Line Interface
======================

For certain actions you can use the ``sentry-cli`` command line
executable.  It can connect to the Sentry API and manage some data for
your projects.  Currently the tool is still very barebones and is
primarily used for managing debug symbols for the iOS integration as well
as basic release management.

Installation
------------

At present `sentry-cli` is only supported on OS X and Linux.  It can be
installed from a terminal with the following command::

    curl -sL https://getsentry.com/get-cli/ | bash

This will automatically download the correct version of ``sentry-cli`` for
your operating system and install it.  If necessarily it will prompt for
your admin password for ``sudo``.

To verify it's installed correctly you can bring up the help::

    $ sentry-cli --help

To sign the cli tool in you can use the `login` command which will guide you
through it::

    $ sentry-cli login

.. sentry:edition:: on-premise

    By default ``sentry-cli`` will connect to app.getsentry.com but for
    on-premise you can also sign in elsewhere::

        $ sentry-cli --url https://myserver.invalid/ login

Configuration
-------------

The `sentry-cli` tool can be configured with a config file named
:file:`.sentryclirc` as well as environment variables.  The config file is
looked for upwards from the current path and defaults from
`~/.sentryclirc` are always loaded.  You can also override these settings
from command line parameters.

The config file uses standard INI syntax.

.. sentry:edition:: on-premise

    By default ``sentry-cli`` will connect to app.getsentry.com.  For
    on-prem you can export the ``SENTRY_URL`` environment variable and
    point it to your installation::

        export SENTRY_URL=https://mysentry.invalid/

    Alternatively you can add it to your ``~/.sentryclirc`` config.  This
    is also what the `login` command does:

    .. sourcecode:: ini

        [defaults]
        url = https://mysentry.invalid/

The following settings are available (first is envvar, second is the
config key in the config file):

``SENTRY_AUTH_TOKEN`` (`auth.token`):
    the authentication token to use for all communication with Sentry.
``SENTRY_API_KEY`` (`auth.api_key`):
    the legacy API key for authentication if you have one.
``SENTRY_URL`` (`defaults.url`):
    The URL to use to connect to sentry.  This defaults to
    ``https://app.getsentry.com/``.
``SENTRY_ORG`` (`defaults.org`):
    the slug of the organization to use for a command.
``SENTRY_PROJECT`` (`defaults.project`):
    the slug of the project to use for a command.

Authentication
--------------

To authenticate ``sentry-cli`` you can to your to your auth token settings
in your user account (User Icon -> API) and generate a new token.
Afterwards you can export the ``SENTRY_AUTH_TOKEN`` environment variable::

    export SENTRY_AUTH_TOKEN=your-auth-token

Alternatively you can provide the ``--auth-token`` command line parameter
whenever you invoke `sentry-cli` or add it to your `.sentryclirc` config
file.

Validating The Config
---------------------

To make sure everything works you can run ``sentry-cli info`` and it should
print out some basic information about the Sentry installation you connect
to as well as some authentication information.

Updating and Uninstalling
-------------------------

You can use ``sentry-cli update`` and ``sentry-cli uninstall`` to update
or uninstall the sentry command line interface.

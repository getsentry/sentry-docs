Authentication
==============

.. _auth-tokens:

Auth Tokens
-----------

Authentication tokens are passed using a the auth header, and are used to
authenticate as a user account with the API.

.. sourcecode:: bash

    $ curl -H 'Authorization: Bearer {TOKEN}' https://sentry.io/api/0/projects/

You can `find or create authentication tokens within Sentry <https://sentry.io/api/>`_.


.. _api-keys:

API Keys
--------

.. note:: API keys are a legacy means of authenticating. They will still be supported
          but are disabled for new accounts. You should use **authentication tokens**
          wherever possible.

API keys are passed using HTTP Basic auth where the username is your api key, and the
password is an empty value.

As an example, to get information about the project which your key is
bound to, you might make a request like so:

.. sourcecode:: bash

    $ curl -u {API_KEY}: https://sentry.io/api/0/projects/

.. note:: You **must** pass a value for the password, which is the reason the ``:``
          is present in our example.

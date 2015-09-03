Authentication
==============

API requests are made using organization-level API keys. They're passed
using HTTP Basic auth where the username is your api key, and the password
is empty.

As an example, to get information about the project which your key is
bound to, you might make a request like so:

.. sourcecode:: bash

    $ curl -u API_KEY: https://app.getsentry.com/api/0/projects/1/

You might notice that some API calls refer to user based authentication.
This is somethign that is currently only available for internal calls to
the API with a user cookie.

.. note:: You **must** pass a value for the password, which is the reason the ``:``
          is present in our example.

Usage
=====

This gives a basic overview of how to use the raven client with Python
directly.

Capture an Error
----------------

The most basic use for raven is to record one specific error that occurs::

    from raven import Client

    client = Client('___DSN___')

    try:
        1 / 0
    except ZeroDivisionError:
        client.captureException()


Adding Context
--------------

A few helpers exist for adding context to a request. These are most useful
within a middleware, or some kind of context wrapper::

    # If you're using the Django client, we already deal with this for you.
    class DjangoUserContext(object):
        def process_request(self, request):
            client.user_context({
                'email': request.user.email,
            })

        def process_response(self, request):
            client.context.clear()


See also:

- Client.extra_context
- Client.http_context
- Client.tags_context


Testing the Client
------------------

Once you've got your server configured, you can test the Raven client by
using its CLI::

    raven test ___DSN___

If you've configured your environment to have ``SENTRY_DSN`` available, you
can simply drop the optional DSN argument::

    raven test

You should get something like the following, assuming you're configured everything correctly::

    $ raven test sync+___DSN___
    Using DSN configuration:
      sync+___DSN___

    Client configuration:
      servers        : ['___API_URL___/api/store/']
      project        : ___PROJECT_ID___
      public_key     : ___PUBLIC_KEY___
      secret_key     : ___SECRET_KEY___

    Sending a test message... success!


Client API
----------

.. autoclass:: raven.base.Client
   :members:

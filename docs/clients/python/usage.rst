Usage
=====

This gives a basic overview of how to use the raven client with Python
directly.

Capture an Error
----------------

The most basic use for raven is to record one specific error that occurs::

    from raven import Client

    client = Client('$$$DSN$$$')

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

    raven test $$$DSN$$$

If you've configured your environment to have ``SENTRY_DSN`` available, you
can simply drop the optional DSN argument::

    raven test

You should get something like the following, assuming you're configured everything correctly::

    $ raven test sync+$$$DSN$$$
    Using DSN configuration:
      sync+$$$DSN$$$

    Client configuration:
      servers        : ['<URL>']
      project        : 1
      public_key     : <PUBLIC KEY>
      secret_key     : <SECRET KEY>

    Sending a test message... success!

    The test message can be viewed at the following URL:
      $$$DSN$$$


Client API
----------

.. autoclass:: raven.base.Client
   :members:

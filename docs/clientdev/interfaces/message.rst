Message Interface
=================

The message interface is a slightly improved version of the ``message``
attribute and can be used to split the log message from the log message
parameters:

.. describe:: sentry.interfaces.message.Message

    Alias: ``logentry``

    A standard message consisting of a ``message`` argugment, and an
    optional list of ``params`` for formatting.  The regular Python
    format string is supported (``%s``, ``%d`` etc.).

    If your message cannot be parameterized, then the message interface
    will serve no benefit.

    ``message`` must be no more than 1000 characters in length.

    .. sourcecode:: json

        {
          "message": "My raw message with interpreted strings like %s",
          "params": ["this"]
        }

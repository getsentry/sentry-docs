Message Interface
=================

The message interface is a slightly improved version of the ``message``
attribute and can be used to split the log message from the log message
parameters:

A standard message, generally associated with parameterized logging.

Attributes:

``message``:
    the raw message string (uninterpolated)
``params``:
    an optional list of formatting parameters
``formatted``:
    the formatted message

``message`` must be no more than 1000 characters in length.

.. sourcecode:: json

    "sentry.interfaces.Message": {
      "message": "My raw message with interpreted strings like %s",
      "params": ["this"]
    }

Exception Interface
===================

An exception consists of a list of values. In most cases, this list
contains a single exception, with an optional stacktrace interface.
Multiple values represent a chained exception, and should be sent
oldest to newest. That is, if your code does this:

.. sourcecode:: python

    try:
        raise Exception
    except Exception as e:
        raise ValueError() from e

The order of exceptions would be ``Exception`` and then ``ValueError``.

Attributes:

``type``:
    the type of exception, e.g. ``ValueError``
``value``:
    the value of the exception (a string)
``module``:
    the optional module, or package which the exception type lives in
``thread_id``:
    an optional value which refers to a thread in the :doc:`threads <threads>`
    interface.
``mechanism``:
    an optional object describing the :doc:`mechanism <mechanism>` that created
    this exception.

You can also optionally bind a :doc:`stacktrace interface <stacktrace>`
to an exception.

.. sourcecode:: json

    "exception": {
      "values": [{
        "type": "ValueError",
        "value": "My exception value",
        "module": "__builtins__",
        "stacktrace": {sentry.interfaces.Stacktrace}
      }]
    }

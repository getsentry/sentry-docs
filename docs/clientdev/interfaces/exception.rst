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

Additionally an optional ``mechanism`` key can be sent with
information about how the exception was delivered from a low level
point of view.  Currently it supports the following nested sub
attributes (the dot signifies a key in a sub object):
``mach_exception.exception_name``, ``mach_exception.code_name``,
``posix_signal.name`` and ``posix_signal.signal``.

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

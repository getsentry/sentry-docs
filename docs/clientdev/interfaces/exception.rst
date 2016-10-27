Exception Interface
===================

.. describe:: sentry.interfaces.exception.Exception

    Alias: ``exception``

    An exception consists of a list of values. In most cases, this list
    contains a single exception, with an optional stacktrace interface.

    Each exception has a mandatory ``value`` argument and optional
    ``type`` and ``module`` arguments describing the exception class type
    and module namespace.

    Optionally a ``thread_id`` attribute can refer to a thread from the
    `threads` interface.

    Additionally an optional ``mechanism`` key can be sent with
    information about how the exception was delivered from a low level
    point of view.  Currently it supports the following nested sub
    attributes (the dot signifies a key in a sub object):
    ``mach_exception.exception_name``, ``mach_exception.code_name``,
    ``posix_signal.name`` and ``posix_signal.signal``.

    You can also optionally bind a :doc:`stacktrace interface <stacktrace>`
    to an exception.

    .. sourcecode:: json

        {
          "values": [{
            "type": "ValueError",
            "value": "My exception value",
            "module": "__builtins__"
            "stacktrace": {sentry.interfaces.Stacktrace}
            }
          }]
        }

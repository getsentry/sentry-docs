Exception Mechanism Interface
=============================

The exception mechanism is an optional field residing in the :doc:`exception`.
It carries additional information about the way the exception was created on the
target system. This includes general exception values obtained from operating
system or runtime APIs, as well as mechanism-specific values.

Attributes
----------

``type``:
    required unique identifier of this mechanism determining rendering and
    processing of the mechanism data
``description``:
    optional human readable description of the error mechanism and a possible
    hint on how to solve this error
``help_link``:
    optional fully qualified URL to an online help resource, possible
    interpolated with error parameters
``handled``:
    optional flag indicating whether the exception has been handled by the user
    (e.g. via ``try..catch``)
``meta``:
    optional information from the operating system or runtime on the exception
    mechanism (see below)
``data``:
    arbitrary extra data that might help the user understand the error thrown by
    this mechanism

.. note::

    The ``type`` attribute is required to send any exception mechanism
    attribute, even if the SDK cannot determine the specific mechanism. In this
    case, set the ``type`` to ``"generic"``. See below for an example.

Meta information
----------------

The mechanism meta data usually carries error codes reported by the runtime or
operating system, along with a platform dependent interpretation of these codes.
SDKs can safely omit code names and descriptions for well known error codes, as
it will be filled out by Sentry. For proprietary or vendor-specific error codes,
adding these values will give additional information to the user.

The ``meta`` key may contain one or more of the following attributes:

``signal``
``````````

Information on the POSIX signal. On Apple systems, signals also carry a code in
addition to the signal number describing the signal in more detail. On Linux,
this code does not exist.

``number``:
    the POSIX signal number
``code``:
    optional Apple signal code
``name``:
    optional name of the signal based on the signal number
``code_name``:
    optional name of the signal code

``mach_exception``
``````````````````

A Mach Exception on Apple systems comprising a code triple and optional
descriptions.

``exception``:
    required numeric exception number
``code``:
    required numeric exception code
``subcode``:
    required numeric exception subcode
``name``:
    optional name of the exception constant in iOS / macOS

``errno``
`````````

Error codes set by linux system calls and some library functions as specified in
ISO C99, POSIX.1-2001 and POSIX.1-2008. See `errno(3)`_ for more
information.

``number``:
    the error number
``name``:
    optional name of the error

Examples
--------

The following examples illustrate payloads that may be sent by SDKs in various
circumstances.

iOS native mach exception
`````````````````````````

.. code:: json

    {
        "type": "mach",
        "handled": false,
        "data": {
            "relevant_address": "0x1"
        },
        "meta": {
            "signal": {
                "number": 10,
                "code": 0,
                "name": "SIGBUS",
                "code_name": "BUS_NOOP"
            },
            "mach_exception": {
                "code": 0,
                "subcode": 8,
                "exception": 1,
                "name": "EXC_BAD_ACCESS"
            }
        }
    }

JavaScript unhandled promise rejection
``````````````````````````````````````

.. code:: json

    {
        "type": "promise",
        "description": "This error originated either by throwing inside of an ...",
        "handled": false,
        "data": {
            "polyfill": "bluebird"
        }
    }

Generic unhandled crash
```````````````````````

.. code:: json

    {
        "type": "generic",
        "handled": false
    }


.. _errno(3): http://man7.org/linux/man-pages/man3/errno.3.html

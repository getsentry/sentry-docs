Exception Mechanism Interface
=============================

The exception mechanism is an optional field residing in the :doc:`exception`.
It carries additional information about the way the exception was created on the
target system. This includes general exception values obtained from operating
system or runtime APIs, as well as mechanism-specific values.

Attributes:

``type``:
    a unique identifier of this mechanism determining rendering and processing
    of the mechanism data
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
    mechanism
``data``:
    arbitrary extra data that might help the user understand the error thrown by
    this mechanism

The ``meta`` key may contain one or more of the following attributes:

``signal``:
    the POSIX signal number
``errno``:
    the ISO C standard error code
``mach_exception``:
    an object containing the mach ``exception``, ``code`` and ``subcode`` numbers
``hresult``:
    the Windows COM error code
``seh_code``:
    the SEH (structured error handling) Win32 / NTSTATUS error code

Example for an iOS native mach exceptions:

.. code:: json

    {
      "type": "mach",
      "description": "EXC_BAD_ACCESS",
      "data": {
        "relevant_address": "0x1"
      },
      "handled": false,
      "help_link": "https://developer.apple.com/library/content/qa/qa1367/_index.html",
      "meta": {
        "mach_exception": {
            "exception": 1,
            "subcode": 8,
            "code": 1
        },
        "signal": 11
      }
    }

Example for an unhandled promise rejection in JavaScript:

.. code:: json

    {
      "type": "promise",
      "description": "This error originated either by throwing inside of an ...",
      "handled": false,
      "data": {
        "polyfill": "bluebird"
      }
    }

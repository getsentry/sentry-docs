Interfaces
==========

Any additional value in the payload of an event which is not an attribute
(:doc:`../attributes`) is assumed to be a data interface, where the key is
the Python path to the interface class name, and the value is the data
expected by the interface.  Interfaces are used in a variety of ways
including storing stacktraces, HTTP request information, and other
metadata.

For the most part interfaces are an evolving part of Sentry.  Like with
attributes, clients are expected to assume more can appear at any point in
the future.  More than that however, for on-premise installations of
Sentry the interfaces can be customized so client libraries should ideally
be written in a way that custom interfaces can be emitted.

Interfaces are typically identified by their full canonical path as it
exists in Sentry.  For built-in interfaces we also provide aliases which
should be used instead.  For instance the full canonical path for the
stacktrace interface is ``sentry.interfaces.Stacktrace`` which is also
available under the alias ``stacktrace``.

Core Data
---------

.. toctree::
    :maxdepth: 1
    :titlesonly:

    exception
    message
    stacktrace
    template

Context
-------

.. toctree::
    :maxdepth: 1
    :titlesonly:

    breadcrumbs
    contexts
    http
    threads
    user

Debug Support
-------------

The debug support interface is only available during processing and is not
stored afterwards.

.. describe:: debug_meta

    This interface can provide temporary debug information that Sentry can
    use to improve reporting.  Currently it is used for symbolication
    only.

    Supported properties:

    ``sdk_info``:
        An object with the following attributes: ``dsym_type``,
        ``sdk_name``, ``version_major``, ``version_minor`` and
        ``version_patchlevel``.  If this object is provided then resolving
        system symbols is activated.  The values provided need to match
        uploaded system symbols to Sentry.
    ``images``:
        A list of debug images.  The ``type`` of the image must be
        provided and the other keys depend on the image type.

    Supported image types:

    ``apple``:
        The format otherwise matches the apple crash reports.  The
        following keys are supported: ``cpu_type``, ``cpu_subtype``,
        ``image_addr``, ``image_size``, ``image_vmaddr``, ``name`` and
        ``uuid``.  Note that it's recommended to use hexadecimal addresses
        (``"0x1234"``) instead of integers.

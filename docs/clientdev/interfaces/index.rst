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

Misc
----

.. toctree::
    :maxdepth: 1
    :titlesonly:

    debug
    sdk

Contexts Interface
==================

The context interfaces provide additional context data.  Typically this is
data related to the current user, the current HTTP request.

.. describe:: contexts

    The ``contexts`` type can be used to defined almost arbitrary
    contextual data on the event.  It accepts an object of key, value
    pairs.  The key is the "alias" of the context and can be freely
    chosen.  However as per policy it should match the type of the context
    unless there are two values for a type.

    Example::

        {
            "os": {
                "type": "os",
                "name": "Windows"
            }
        }

    If the type is omitted it uses the alias as type.

    Unknown data for the contexts is rendered as a key/value list.

Context Types
-------------

The following types are known:

.. describe:: device

    This describes the device that caused the event.  This is most
    appropriate for mobile applications.

    Attributes:

    ``name``:
        the name of the device.  This is typically a hostname.
    ``family``:
        the family of the device.  This is normally the common part of
        model names across generations.  For instance ``iPhone`` would be
        a reasonable family, so would be ``Samsung Galaxy``.
    ``model``:
        The model name.  This for instance can be ``Samsung Galaxy S3``.
    ``model_id``:
        An internal hardware revision to identify the device exactly.
    ``arch``:
        The CPU architecture.
    ``battery_level``:
        If the device has a battery this can be an integer defining the
        battery level (in the range 0-100).
    ``orientation``:
        This can be a string ``portrait`` or ``landscape`` to define the
        orientation of a device.

.. describe:: os

    Defines the operating system that created the event.

    Attributes:

    ``name``:
        The name of the operating system
    ``version``:
        The version of the operating system
    ``build``:
        The internal build revision of the operating system
    ``kernel_version``:
        If known this can be an independent kernel version string.
        Typically this is something like the entire output of the uname
        tool.
    ``rooted``:
        An optional bool that defines if the OS has been jailbroken or
        rooted.

.. describe:: runtime

    This describes a runtime in more detail.  Typically this context is
    used multiple times if multiple runtimes are involved (for instance if
    you have a JavaScript application running on top of JVM)

    Attributes:

    ``name``:
        The name of the runtime.
    ``version``:
        The version identifier of the runtime.

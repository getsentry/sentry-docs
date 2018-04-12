Contexts Interface
==================

The context interfaces provide additional context data.  Typically this is data
related to the current user, the current HTTP request.

The ``contexts`` type can be used to defined almost arbitrary contextual data on
the event.  It accepts an object of key, value pairs.  The key is the "alias" of
the context and can be freely chosen.  However as per policy it should match the
type of the context unless there are two values for a type.

Example::

    "contexts": {
        "os": {
            "type": "os",
            "name": "Windows"
        }
    }

If ``type`` is omitted it uses the alias as type.

Unknown data for the contexts is rendered as a key/value list.

Context Types
-------------

The following types are known:

.. describe:: device

    This describes the device that caused the event.  This is most appropriate
    for mobile applications.

    Attributes:

    ``name``:
        The name of the device.  This is typically a hostname.
    ``family``:
        The family of the device.  This is normally the common part of model
        names across generations.  For instance ``iPhone`` would be a reasonable
        family, so would be ``Samsung Galaxy``.
    ``model``:
        The model name.  This for instance can be ``Samsung Galaxy S3``.
    ``model_id``:
        An internal hardware revision to identify the device exactly.
    ``arch``:
        The CPU architecture.
    ``battery_level``:
        If the device has a battery this can be an floating point value
        defining the battery level (in the range 0-100).
    ``orientation``:
        This can be a string ``portrait`` or ``landscape`` to define the
        orientation of a device.
    ``simulator``:
        A boolean defining whether this device is a simulator or an actual
        device.
    ``memory_size``:
        Total system memory available in bytes.
    ``free_memory``:
        Free system memory in bytes.
    ``usable_memory``:
        Memory usable for the app in bytes.
    ``storage_size``:
        Total device storage in bytes.
    ``free_storage``:
        Free device storage in bytes.
    ``external_storage_size``:
        Total size of an attached external storage in bytes (e.g.: android SDK
        card).
    ``external_free_storage``:
        Free size of an attached external storage in bytes (e.g.: android SDK
        card).
    ``boot_time``:
        A formatted UTC timestamp when the system was booted, e.g.:
        ``"2018-02-08T12:52:12Z"``.
    ``timezone``:
        The timezone of the device, e.g.: ``Europe/Vienna``.

.. describe:: os

    Describes the operating system on which the event was created. In web
    contexts, this is the operating system of the browser (normally pulled from
    the User-Agent string).

    Attributes:

    ``name``:
        The name of the operating system.
    ``version``:
        The version of the operating system.
    ``build``:
        The internal build revision of the operating system.
    ``kernel_version``:
        If known, this can be an independent kernel version string. Typically
        this is something like the entire output of the ``uname`` tool.
    ``rooted``:
        An optional boolean that defines if the OS has been jailbroken or
        rooted.

.. describe:: runtime

    Describes a runtime in more detail.  Typically this context is used multiple
    times if multiple runtimes are involved (for instance if you have a
    JavaScript application running on top of JVM)

    Attributes:

    ``name``:
        The name of the runtime.
    ``version``:
        The version identifier of the runtime.

.. describe:: app

    Describes the application.  As opposed to the runtime, this is the actual
    application that was running and carries meta data about the current
    session.

    Attributes:

    ``app_start_time``:
        Formatted UTC timestamp when the application was started by the user.
    ``device_app_hash``:
        Application specific device identifier.
    ``build_type``:
        String identifying the kind of build, e.g. ``testflight``.
    ``app_identifier``:
        Version-independent application identifier, often a dotted bundle ID.
    ``app_name``:
        Human readable application name, as it appears on the platform.
    ``app_version``:
        Human readable application version, as it appears on the platform.
    ``app_build``:
        Internal build identifier, as it appears on the platform.

.. describe:: browser

    Carries information about the browser or user agent for web-related errors.
    This can either be the browser this event ocurred in, or the user agent of a
    web request that triggered the event.

    Attributes:

    ``name``:
        Display name of the browser application.
    ``version``:
        Version string of the browser.

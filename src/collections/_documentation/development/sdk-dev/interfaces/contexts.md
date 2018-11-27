---
title: 'Contexts Interface'
sidebar_order: 6
---

The context interfaces provide additional context data. Typically this is data
related to the current user, the current HTTP request. Its canonical name is `"contexts"`.

The `contexts` type can be used to defined almost arbitrary contextual data on
the event. It accepts an object of key, value pairs. The key is the “alias” of
the context and can be freely chosen. However as per policy it should match the
type of the context unless there are two values for a type.

Example:

```json
"contexts": {
  "os": {
    "type": "os",
    "name": "Windows"
  }
}
```

If `type` is omitted it uses the key name as type.

Unknown data for the contexts is rendered as a key/value list.

## Context Types

The following types are known:

`device`

: This describes the device that caused the event. This is most appropriate for
  mobile applications.

  Attributes:

  `name`:

  : _Optional_. The name of the device. This is typically a hostname.

  `family`:

  : _Optional_. The family of the device. This is normally the common part of
    model names across generations. For instance `iPhone` would be a reasonable
    family, so would be `Samsung Galaxy`.

  `model`:

  : _Optional_. The model name. This for instance can be `Samsung Galaxy S3`.

  `model_id`:

  : _Optional_. An internal hardware revision to identify the device exactly.

  `arch`:

  : _Optional_. The CPU architecture.

  `battery_level`:

  : _Optional_. If the device has a battery, this can be an floating point value
    defining the battery level (in the range 0-100).

  `orientation`:

  : _Optional_. This can be a string `portrait` or `landscape` to define the
    orientation of a device.

  `simulator`:

  : _Optional_. A flag indicating whether this device is a simulator or an
  actual device.

  `memory_size`:

  : _Optional_. Total system memory available in bytes.

  `free_memory`:

  : _Optional_. Free system memory in bytes.

  `usable_memory`:

  : _Optional_. Memory usable for the app in bytes.

  `storage_size`:

  : _Optional_. Total device storage in bytes.

  `free_storage`:

  : _Optional_. Free device storage in bytes.

  `external_storage_size`:

  : _Optional_. Total size of an attached external storage in bytes (e.g.:
    android SDK card).

  `external_free_storage`:

  : _Optional_. Free size of an attached external storage in bytes (e.g.:
  android SDK card).

  `boot_time`:

  : _Optional_. A formatted UTC timestamp when the system was booted, e.g.:
    `"2018-02-08T12:52:12Z"`.

  `timezone`:

  : _Optional_. The timezone of the device, e.g.: `Europe/Vienna`.

`os`

: Describes the operating system on which the event was created. In web
  contexts, this is the operating system of the browser (normally pulled from
  the User-Agent string).

  Attributes:

  `name`:

  : _Optional_. The name of the operating system.

  `version`:

  : _Optional_. The version of the operating system.

  `build`:

  : _Optional_. The internal build revision of the operating system.

  `kernel_version`:

  : _Optional_. An independent kernel version string. This is typically the
    entire output of the `uname` syscall.

  `rooted`:

  : _Optional_. A flag indicating whether the OS has been jailbroken or rooted.

  `raw_description`:

  : _Optional_. An unprocessed description string obtained by the operating
    system. For some well-known runtimes, Sentry will attempt to parse `name`
    and `version` from this string, if they are not explicitly given.


`runtime`

: Describes a runtime in more detail. Typically this context is used multiple
  times if multiple runtimes are involved (for instance if you have a JavaScript
  application running on top of JVM)

  Attributes:

  `name`:

  : _Optional_. The name of the runtime.

  `version`:

  : _Optional_. The version identifier of the runtime.

  `raw_description`:

  : _Optional_. An unprocessed description string obtained by the runtime. For
    some well-known runtimes, Sentry will attempt to parse `name` and `version`
    from this string, if they are not explicitly given.

`app`

: Describes the application. As opposed to the runtime, this is the actual
  application that was running and carries meta data about the current session.

  Attributes:

  `app_start_time`:

  : _Optional_. Formatted UTC timestamp when the application was started by the
    user.

  `device_app_hash`:

  : _Optional_. Application specific device identifier.

  `build_type`:

  : _Optional_. String identifying the kind of build, e.g. `testflight`.

  `app_identifier`:

  : _Optional_. Version-independent application identifier, often a dotted
    bundle ID.

  `app_name`:

  : _Optional_. Human readable application name, as it appears on the platform.

  `app_version`:

  : _Optional_. Human readable application version, as it appears on the
    platform.

  `app_build`:

  : _Optional_. Internal build identifier, as it appears on the platform.

`browser`

: Carries information about the browser or user agent for web-related errors.
  This can either be the browser this event ocurred in, or the user agent of a
  web request that triggered the event.

  Attributes:

  `name`:

  : _Optional_. Display name of the browser application.

  `version`:

  : _Optional_. Version string of the browser.

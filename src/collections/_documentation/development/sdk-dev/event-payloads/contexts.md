---
title: Contexts Interface
sidebar_order: 9
---

The context interfaces provide additional context data. Typically, this is data
related to the current user and the environment. For example, the device or application version. Its canonical name is
`contexts`.

The `contexts` type can be used to define arbitrary contextual data on the
event. It accepts an object of key/value pairs. The key is the “alias” of the
context and can be freely chosen. However, as per policy, it should match the
type of the context unless there are two values for a type. You can omit `type`
if the key name is the type.

Unknown data for the contexts is rendered as a key/value list.

## Device Context

Device context describes the device that caused the event. This is most
appropriate for mobile applications. 

The `type` and default key is `"device"`.

`name`:

: **Required**. The name of the device. This is typically a hostname.

`family`:

: _Optional_. The family of the device. This is usually the common part of model
  names across generations. For instance, `iPhone` would be a reasonable family,
  so would be `Samsung Galaxy`.

`model`:

: _Optional_. The model name. This, for example, can be `Samsung Galaxy S3`.

`model_id`:

: _Optional_. An internal hardware revision to identify the device exactly.

`arch`:

: _Optional_. The CPU architecture.

`battery_level`:

: _Optional_. If the device has a battery, this can be a floating point value
  defining the battery level (in the range 0-100).

`orientation`:

: _Optional_. This can be a string `portrait` or `landscape` to define the
  orientation of a device.

`manufacturer`:

: _Optional_. The manufacturer of the device.

`brand`:

: _Optional_. The brand of the device.

`screen_resolution`:

: _Optional_. The screen resolution. (e.g.: 800x600, 3040x1444).

`screen_density`:

: _Optional_. A floating point denoting the screen density.

`screen_dpi`:

: _Optional_. A decimal value reflecting the DPI (dots-per-inch) density.

`online`:

: _Optional_. Whether the device was online or not.

`charging`:

: _Optional_. Whether the device was charging or not.

`low_memory`:

: _Optional_. Whether the device was low on memory.

`simulator`:

: _Optional_. A flag indicating whether this device is a simulator or an actual
  device.

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

: _Optional_. Total size of an attached external storage in bytes (for example,
  android SDK card).

`external_free_storage`:

: _Optional_. Free size of an attached external storage in bytes (for example,
  android SDK card).

`boot_time`:

: _Optional_. A formatted UTC timestamp when the system was booted. For example,
  `"2018-02-08T12:52:12Z"`.

`timezone`:

: _Optional_. The timezone of the device. For example, `Europe/Vienna`.

## OS Context

OS context describes the operating system on which the event was created. In web
contexts, this is the operating system of the browser (generally pulled from the
User-Agent string).

The `type` and default key is `"os"`.

`name`:

: **Required**. The name of the operating system.

`version`:

: _Optional_. The version of the operating system.

`build`:

: _Optional_. The internal build revision of the operating system.

`kernel_version`:

: _Optional_. An independent kernel version string. This is typically the entire
  output of the `uname` syscall.

`rooted`:

: _Optional_. A flag indicating whether the OS has been jailbroken or rooted.

`raw_description`:

: _Optional_. An unprocessed description string obtained by the operating
  system. For some well-known runtimes, Sentry will attempt to parse `name` and
  `version` from this string, if they are not explicitly given.

## Runtime Context

Runtime context describes a runtime in more detail. Typically, this context is
used multiple times if multiple runtimes are involved (for instance, if you have
a JavaScript application running on top of JVM).

The `type` and default key is `"runtime"`.

`name`:

: **Required**. The name of the runtime.

`version`:

: _Optional_. The version identifier of the runtime.

`raw_description`:

: _Optional_. An unprocessed description string obtained by the runtime. For
  some well-known runtimes, Sentry will attempt to parse `name` and `version`
  from this string, if they are not explicitly given.

## App Context

App context describes the application. As opposed to the runtime, this is the
actual application that was running and carries metadata about the current
session.

The `type` and default key is `"app"`.

`app_start_time`:

: _Optional_. Formatted UTC timestamp when the user started the application.

`device_app_hash`:

: _Optional_. Application-specific device identifier.

`build_type`:

: _Optional_. String identifying the kind of build. For example, `testflight`.

`app_identifier`:

: _Optional_. Version-independent application identifier, often a dotted bundle
  ID.

`app_name`:

: _Optional_. Human readable application name, as it appears on the platform.

`app_version`:

: _Optional_. Human readable application version, as it appears on the platform.

`app_build`:

: _Optional_. Internal build identifier, as it appears on the platform.

## Browser Context

Browser context carries information about the browser or user agent for
web-related errors. This can either be the browser this event occurred in or the
user agent of a web request that triggered the event.

The `type` and default key is `"browser"`.

`name`:

: **Required**. Display name of the browser application.

`version`:

: _Optional_. Version string of the browser.

## GPU Context

GPU context describes the GPU of the device.

`name`:

: **Required**. The name of the graphics device.

`version`:

: _Optional_. The Version of the graphics device.

`id`:

: _Optional_. The PCI identifier of the graphics device.

`vendor_id`:

: _Optional_. The PCI vendor identifier of the graphics device.

`vendor_name`:

: _Optional_. The vendor name as reported by the graphics device.

`memory_size`:

: _Optional_. The total GPU memory available in Megabytes.

`api_type`:

: _Optional_. The device low-level API type.

  Examples: `"Apple Metal"` or `"Direct3D11"`

`multi_threaded_rendering`:

: _Optional_. Whether the GPU has multi-threaded rendering or not.

`npot_support`:

: _Optional_. The Non-Power-Of-Two-Support support.

Example:

```json
"gpu": {
  "name": "AMD Radeon Pro 560",
  "vendor_name": "Apple",
  "memory_size": 4096,
  "api_type": "Metal",
  "multi_threaded_rendering": true,
  "version": "Metal",
  "npot_support": "Full"
}
```

## Examples

```json
{
  "contexts": {
    "os": {
      "name": "Windows"
    },
    "electron": {
      "type": "runtime",
      "name": "Electron",
      "version": "4.0"
    }
  }
}
```

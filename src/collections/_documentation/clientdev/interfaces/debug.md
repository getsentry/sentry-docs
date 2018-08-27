---
title: 'Debug Interface'
sidebar_order: 11
---

The debug support interface is only available during processing and is not stored afterwards.

`debug_meta`

: This interface can provide temporary debug information that Sentry can use to improve reporting. Currently it is used for symbolication only.

  Supported properties:

  `sdk_info`:

  : An object with the following attributes: `dsym_type`, `sdk_name`, `version_major`, `version_minor` and `version_patchlevel`. If this object is provided then resolving system symbols is activated. The values provided need to match uploaded system symbols to Sentry.

  `images`:

  : A list of debug images. The `type` of the image must be provided and the other keys depend on the image type.

  Supported image types:

  `apple`:

  : The format otherwise matches the apple crash reports. The following keys are supported: `cpu_type`, `cpu_subtype`, `image_addr`, `image_size`, `image_vmaddr`, `name` and `uuid`. Note that it’s recommended to use hexadecimal addresses (`"0x1234"`) instead of integers.

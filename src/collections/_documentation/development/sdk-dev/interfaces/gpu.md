---
title: 'GPU Interface'
sidebar_order: 13
---

An interface which describes the main GPU of the device.

##### `name`

**Required**. The name of the graphics device.

##### `version`

_Optional_. The Version of graphics device.

##### `id`

_Optional_. The PCI Id of the graphics device.

##### `vendor_id`

_Optional_. The PCI vendor Id of the graphics device.

##### `vendor_name`

_Optional_. The vendor name as reported by the graphics device.

##### `memry_size`

_Optional_. The total GPU memory available in Megabytes.

##### `api_type`

_Optional_. The device low level API type. 

Examples: `Apple Metal` or `Direct3D11`

##### `multi_threaded_rendering`

_Optional_. Whether the GPU has multi-threaded rendering or not.

##### `npot_support`

_Optional_. The Non-Power-Of-Two-Support support


## Example

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

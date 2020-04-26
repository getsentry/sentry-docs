---
title: Debug Meta Interface
sidebar_order: 11
---

The debug meta interface carries debug information for processing errors and
crash reports. Sentry amends the information in this interface.

## Attributes

`sdk_info`:

: An object describing the system SDK: `sdk_name`, `version_major`,
  `version_minor`, and `version_patchlevel`. This helps Sentry locate iOS
  system symbols, and is not required for other SDKs.

  ```json
  {
    "sdk_name": "iOS",
    "version_major": 10,
    "version_minor": 3,
    "version_patchlevel": 0
  }
  ```

`images`:

: A list of dynamic libraries loaded into the process (see below).

## Debug Images

The list of debug images contains all dynamic libraries loaded into the process
and their memory addresses. Instruction addresses in the [_Stack Trace_]({%-
link _documentation/development/sdk-dev/event-payloads/stacktrace.md -%}) are
mapped into the list of debug images in order to retrieve debug files for
symbolication.

There are two kinds of debug images:

 - Native debug images with types `macho`, `elf`, and `pe`
 - Android debug images with type `proguard`

### MachO Images

MachO images are used on Apple platforms. Their structure is identical to other
native images.

Attributes:

`type`:

: **Required**. Type of the debug image. Must be `"macho"`.

`image_addr`:

: **Required**. Memory address, at which the image is mounted in the virtual
  address space of the process. Should be a string in hex representation
  prefixed with `"0x"`.

`image_size`:

: **Required**. The size of the image in virtual memory. If missing, Sentry will
  assume that the image spans up to the next image, which might lead to invalid
  stack traces.

`debug_id`:

: **Required**. Identifier of the dynamic library or executable. It is the value
  of the `LC_UUID` load command in the Mach header, formatted as UUID.

`debug_file`:

: _Optional_: Name or absolute path to the dSYM file containing debug
  information for this image. This value might be required to retrieve debug
  files from certain symbol servers.

`code_id`:

: _Optional_. Identifier of the dynamic library or executable. It is the value
  of the `LC_UUID` load command in the Mach header, formatted as UUID. Can be
  empty for Mach images, as it is equivalent to the debug identifier.

`code_file`:

: _Optional_. The absolute path to the dynamic library or executable. This helps
  to locate the file if it is missing on Sentry.

`image_vmaddr`:

: _Optional_: Preferred load address of the image in virtual memory, as declared
  in the headers of the image. When loading an image, the operating system may
  still choose to place it at a different address. 
  
  If this value is non-zero, all symbols and addresses declared in the native
  image start at this address, rather than `0`. By contrast, Sentry deals with
  addresses relative to the start of the image. For example, with
  `image_vmaddr: 0x40000`, a symbol located at `0x401000` has a relative address
  of `0x1000`.
  
  Relative addresses used in Apple Crash Reports and `addr2line` are usually in
  the preferred address space, and not relative address space.
  
`arch`:

: _Optional_: Architecture of the module. If missing, this will be backfilled by
  Sentry.

Example:

```json
{
  "type": "macho",
  "debug_id": "84a04d24-0e60-3810-a8c0-90a65e2df61a",
  "debug_file": "libDiagnosticMessagesClient.dylib",
  "code_file": "/usr/lib/libDiagnosticMessagesClient.dylib",
  "image_addr": "0x7fffe668e000",
  "image_size": 8192,
  "image_vmaddr": "0x40000",
  "arch": "x86_64",
}
```

### ELF Images

ELF images are used on Linux platforms. Their structure is identical to other
native images.

Attributes:

`type`:

: **Required**. Type of the debug image. Must be `"elf"`.

`image_addr`:

: **Required**. Memory address, at which the image is mounted in the virtual
  address space of the process. Should be a string in hex representation
  prefixed with `"0x"`.

`image_size`:

: **Required**. The size of the image in virtual memory. If missing, Sentry will
  assume that the image spans up to the next image, which might lead to invalid
  stack traces.

`debug_id`:

: **Required**. Debug identifier of the dynamic library or executable. If a code
  identifier is available, the debug identifier is the _little-endian UUID_
  representation of the first 16-bytes of that identifier. Spaces are inserted
  for readability, note the byte order of the first fields:

  ```
  code id:  f1c3bcc0 2798 65fe 3058 404b2831d9e6 4135386c
  debug id: c0bcc3f1-9827-fe65-3058-404b2831d9e6
  ```

  If no code id is available, the debug id should be computed by XORing the
  first 4096 bytes of the `.text` section in 16-byte chunks, and representing it
  as a little-endian UUID (again swapping the byte order).

`debug_file`:

: _Optional_: Name or absolute path to the file containing stripped debug
  information for this image. This value might be required to retrieve debug
  files from certain symbol servers.

`code_id`:

: _Optional_. Identifier of the dynamic library or executable. If the program
  was compiled with a relatively recent compiler, this should be the hex
  representation of the `NT_GNU_BUILD_ID` program header (type `PT_NOTE`), or
  the value of the `.note.gnu.build-id` note section (type `SHT_NOTE`).
  Otherwise, leave this value empty.
  
  Certain symbol servers use the code identifier to locate debug information for
  ELF images, in which case this field should be included if possible.

`code_file`:

: _Optional_. The absolute path to the dynamic library or executable. This helps
  to locate the file if it is missing on Sentry.

`image_vmaddr`:

: _Optional_: Preferred load address of the image in virtual memory, as declared
  in the headers of the image. When loading an image, the operating system may
  still choose to place it at a different address. 
  
  If this value is non-zero, all symbols and addresses declared in the native
  image start at this address, rather than `0`. By contrast, Sentry deals with
  addresses relative to the start of the image. For example, with
  `image_vmaddr: 0x40000`, a symbol located at `0x401000` has a relative address
  of `0x1000`.
  
  Relative addresses used in `addr2line` are usually in the preferred address
  space, and not relative address space.

`arch`:

: _Optional_: Architecture of the module. If missing, this will be backfilled by
  Sentry.

Example:

```json
{
  "type": "elf",
  "code_id": "68220ae2c65d65c1b6aaa12fa6765a6ec2f5f434",
  "code_file": "/lib/x86_64-linux-gnu/libgcc_s.so.1",
  "debug_id": "e20a2268-5dc6-c165-b6aa-a12fa6765a6e",
  "image_addr": "0x7f5140527000",
  "image_size": 90112,
  "image_vmaddr": "0x40000",
  "arch": "x86_64"
}
```

### PE Images (PDBs)

PE images are used on Windows platforms and are accompanied by PDB files for
debugging. Their structure is identical to other native images.

`type`:

: **Required**. Type of the debug image. Must be `"pe"`.

`image_addr`:

: **Required**. Memory address, at which the image is mounted in the virtual
  address space of the process. Should be a string in hex representation
  prefixed with `"0x"`.

`image_size`:

: **Required**. The actual size of the image in virtual memory. If missing,
  Sentry will assume that the image spans up to the next image, which might lead
  to invalid stack traces.

`debug_id`:

: **Required**. `signature` and `age` of the PDB file. Both values can be read
  from the CodeView PDB70 debug information header in the PE. The value should
  be represented as _little-endian UUID_, with the age appended at the end. Note
  that the byte order of the UUID fields must be swapped (spaces inserted for
  readability):

  ```
  signature: f1c3bcc0 2798 65fe 3058 404b2831d9e6
  age:                                            1
  debug_id:  c0bcc3f1-9827-fe65-3058-404b2831d9e6-1
  ```

`debug_file`:

: **Required**: Name of the PDB file containing debug information for this
  image. This value is often required to retrieve debug files from specific
  symbol servers.

`code_id`:

: _Optional_. Identifier of the executable or DLL. It contains the values of the
  `time_date_stamp` from the COFF header and `size_of_image` from the optional
  header formatted together into a hex string using `%08x%X` (note that the
  second value is not padded):

  ```
  time_date_stamp: 0x5ab38077
  size_of_image:           0x9000
  code_id:           5ab380779000
  ```

  The code identifier should be provided to allow server-side stack walking of
  binary crash reports, such as Minidumps.

`code_file`:

: _Optional_. The absolute path to the DLL or executable. This helps to locate
  the file if it is missing on Sentry. The code file should be provided to allow
  server-side stack walking of binary crash reports, such as Minidumps.

`image_vmaddr`:

: _Optional_: Preferred load address of the image in virtual memory, as declared
  in the headers of the image. When loading an image, the operating system may
  still choose to place it at a different address. 
  
  Symbols and addresses in the native image are always relative to the start of
  the image and do not consider the preferred load address. It is merely a hint
  to the loader.

`arch`:

: _Optional_: Architecture of the module. If missing, this will be backfilled by
  Sentry.

Example:

```json
{
  "type": "pe",
  "code_id": "57898e12145000",
  "code_file": "C:\\Windows\\System32\\dbghelp.dll",
  "debug_id": "9c2a902b-6fdf-40ad-8308-588a41d572a0-1",
  "debug_file": "dbghelp.pdb",
  "image_addr": "0x70850000",
  "image_size": "1331200",
  "image_vmaddr": "0x40000",
  "arch": "x86"
}
```

### Proguard Images

Proguard images refer to `mapping.txt` files generated when Proguard obfuscates
function names. The Java SDK integrations assign this file a unique identifier,
which has to be included in the list of images.

`uuid`:

: **Required**. The unique identifier assigned by the Java SDK.

Example:

```json
{
  "uuid": "395835f4-03e0-4436-80d3-136f0749a893"
}
```

## Examples

See examples for types of debug images above.

```json
{
  "debug_meta": {
    "images": [],
    "sdk_info": {
      "sdk_name": "iOS",
      "version_major": 10,
      "version_minor": 3,
      "version_patchlevel": 0
    }
  }
}
```

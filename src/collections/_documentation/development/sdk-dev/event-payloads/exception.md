---
title: Exception Interface
sidebar_order: 2
---

An exception consists of a list of values. In most cases, this list contains a
single exception, with an optional stack trace interface. Multiple values
represent a chained exception, and should be sent oldest to newest. That is, if
your code does this:

```python
try:
    raise Exception
except Exception as e:
    raise ValueError() from e
```

The order of exceptions would be `Exception` and then `ValueError`.

## Attributes

`type`:

: The type of exception, e.g. `ValueError`.

`value`:

: The value of the exception (a string).

`module`:

: The optional module, or package which the exception type lives in.

`thread_id`:

: An optional value which refers to a thread in the
  [_Threads Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/threads.md -%}).

`mechanism`:

: An optional object describing the [mechanism](#exception-mechanism) that
  created this exception (see below).

`stacktrace`:

: An optional stack trace object corresponding to the [_Stack Trace
  Interface_]({%- link
  _documentation/development/sdk-dev/event-payloads/stacktrace.md -%}).

## Exception Mechanism

The exception mechanism is an optional field residing in the [_Exception
Interface_](#exception-interface). It carries additional information about the
way the exception was created on the target system. This includes general
exception values obtained from the operating system or runtime APIs, as well as
mechanism-specific values.

### Attributes

`type`:

: Required unique identifier of this mechanism determining rendering and
  processing of the mechanism data.

`description`:

: Optional human-readable description of the error mechanism and a possible hint
  on how to solve this error.

`help_link`:

: Optional fully qualified URL to an online help resource, possible interpolated
  with error parameters.

`handled`:

: Optional flag indicating whether the user has handled the exception
  (for example, via `try ... catch`).

`meta`:

: Optional information from the operating system or runtime on the exception
  mechanism (see below).

`data`:

: Arbitrary extra data that might help the user understand the error thrown by
  this mechanism.

{% capture __alert_content -%}
The `type` attribute is required to send any exception mechanism attribute, even
if the SDK cannot determine the specific mechanism. In this case, set the `type`
to `generic`. See below for an example.
{%- endcapture -%}

{%- include components/alert.html title="Note" content=__alert_content level="warning"%}

### Meta information

The mechanism metadata usually carries error codes reported by the runtime or
operating system, along with a platform-dependent interpretation of these codes.
SDKs can safely omit code names and descriptions for well-known error codes, as
it will be filled out by Sentry. For proprietary or vendor-specific error codes,
adding these values will give additional information to the user.

The `meta` key may contain one or more of the following attributes:

#### `signal`

Information on the POSIX signal. On Apple systems, signals also carry a code in
addition to the signal number describing the signal in more detail. On Linux,
this code does not exist.

`number`:

: The POSIX signal number.

`code`:

: Optional Apple signal code.

`name`:

: Optional name of the signal based on the signal number.

`code_name`:

: Optional name of the signal code.

#### `mach_exception`

A Mach Exception on Apple systems comprising a code triple and optional
descriptions.

`exception`:

: Required numeric exception number.

`code`:

: Required numeric exception code.

`subcode`:

: Required numeric exception subcode.

`name`:

: Optional name of the exception constant in iOS / macOS.

#### `errno`

Error codes set by Linux system calls and some library functions as specified in
ISO C99, POSIX.1-2001, and POSIX.1-2008. See
[errno(3)](http://man7.org/linux/man-pages/man3/errno.3.html) for more
information.

`number`:

: The error number

`name`:

: Optional name of the error

## Examples

The following examples illustrate payloads that may be sent by SDKs in various
circumstances.

A single exception:

```json
{
  "exception": {
    "type": "ValueError",
    "value": "My exception value",
    "module": "__builtins__",
    "stacktrace": {},
  }
}
```

A list of exceptions:

```json
{
  "exception": {
    "values": [
      {
        "type": "Exception",
        "value": "Wrapped exception value",
        "module": "__builtins__"
      },
      {
        "type": "ValueError",
        "value": "Original Exception value",
        "module": "__builtins__"
      },
    ]
  }
}
```

iOS native mach exception with mechanism:

```json
{
  "exception": {
    "type": "EXC_BAD_ACCESS",
    "value": "Attempted to dereference a null pointer",
    "mechanism": {
      "type": "mach",
      "handled": false,
      "data": {
        "relevant_address": "0x1"
      },
      "meta": {
        "signal": {
          "number": 10,
          "code": 0,
          "name": "SIGBUS",
          "code_name": "BUS_NOOP"
        },
        "mach_exception": {
          "code": 0,
          "subcode": 8,
          "exception": 1,
          "name": "EXC_BAD_ACCESS"
        }
      }
    }
  }
}
```

JavaScript unhandled promise rejection:

```json
{
  "exception": {
    "type": "TypeError",
    "value": "Object [object Object] has no method 'foo'",
    "mechanism": {
      "type": "promise",
      "description": "This error originated either by throwing inside of an ...",
      "handled": false,
      "data": {
        "polyfill": "bluebird"
      }
    }
  }
}
```

Generic unhandled crash:

```json
{
    "type": "generic",
    "handled": false
}
```

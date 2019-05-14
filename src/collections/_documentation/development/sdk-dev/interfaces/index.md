---
title: Interfaces
sidebar_order: 4
---

Any additional value in the payload of an event which is not an attribute (see
[_Attributes_]({%- link _documentation/development/sdk-dev/attributes.md -%})) is assumed
to be a data interface, where the key is the canonical interface short name, and
the value is the data expected by the interface (usually a dictionary).
Interfaces are used in a variety of ways including storing stack traces, HTTP
request information, and other metadata.

For the most part, interfaces are an evolving part of Sentry. Like with
attributes, SDKs are expected to assume that more interfaces will be added at
any point in the future.

## Core Data

- [Exception Interface]({%- link _documentation/development/sdk-dev/interfaces/exception.md -%})
- [Log Entry Interface]({%- link _documentation/development/sdk-dev/interfaces/message.md -%})
- [Stacktrace Interface]({%- link _documentation/development/sdk-dev/interfaces/stacktrace.md -%})
- [Exception Mechanism Interface]({%- link _documentation/development/sdk-dev/interfaces/mechanism.md -%})
- [Template Interface]({%- link _documentation/development/sdk-dev/interfaces/template.md -%})

### Exception Interface

An exception consists of a list of values. In most cases, this list contains a single exception, with an optional stack trace interface. Multiple values represent a chained exception, and should be sent oldest to newest. That is, if your code does this:

```python
try:
    raise Exception
except Exception as e:
    raise ValueError() from e
```

The order of exceptions would be `Exception` and then `ValueError`.

Attributes:

`type`:

: the type of exception, e.g. `ValueError`

`value`:

: the value of the exception (a string)

`module`:

: the optional module, or package which the exception type lives in

`thread_id`:

: an optional value which refers to a thread in the [_threads_]({%- link _documentation/development/sdk-dev/interfaces/threads.md -%}) interface.

`mechanism`:

: an optional object describing the [_mechanism_]({%- link _documentation/development/sdk-dev/interfaces/mechanism.md -%}) that created this exception.

You can also optionally bind a [_stack trace interface_]({%- link _documentation/development/sdk-dev/interfaces/stacktrace.md -%}) to an exception.

```json
"exception": {
  "values": [{
    "type": "ValueError",
    "value": "My exception value",
    "module": "__builtins__",
    "stacktrace": {sentry.interfaces.Stacktrace}
  }]
}
```

### Log Entry Interface

The Log Entry Interface is a slightly improved version of the `message` attribute and can be used to split the log message from the log message parameters:

A standard message, generally associated with parameterized logging.

Attributes:

`message`:

: the raw message string (uninterpolated)

`params`:

: an optional list of formatting parameters

`formatted`:

: the formatted message

`message` must be no more than 1000 characters in length.

```json
"sentry.interfaces.Message": {
  "message": "My raw message with interpreted strings like %s",
  "params": ["this"]
}
```

### Stacktrace Interface

A stack trace contains a list of frames, each with various bits (most optional) describing the context of that frame. Frames should be sorted from oldest to newest.

The stack trace contains an element, `frames`, which is a list of hashes. Each hash must contain **at least** the `filename` attribute. The rest of the values are optional, but recommended.

Additionally, if the list of frames is large, you can explicitly tell the system that you’ve omitted a range of frames. The `frames_omitted` must be a single tuple two values: start and end. For example, if you only removed the 8th frame, the value would be (8, 9), meaning it started at the 8th frame, and went until the 9th (the number of frames omitted is end-start). The values should be based on a one-index.

The list of frames should be ordered by the oldest call first.

Each frame must contain at least one of the following attributes:

`filename`

: The relative filepath to the call

`function`

: The name of the function being called

`module`

: Platform-specific module path (e.g. sentry.interfaces.Stacktrace)

Optional core attributes:

`lineno`

: The line number of the call

`colno`

: The column number of the call

`abs_path`

: The absolute path to filename

`context_line`

: Source code in filename at lineno

`pre_context`

: A list of source code lines before context_line (in order) – usually `[lineno - 5:lineno]`

`post_context`

: A list of source code lines after context_line (in order) – usually `[lineno + 1:lineno + 5]`

`in_app`

: Signifies whether this frame is related to the execution of the relevant code in this stack trace. For example, the frames that might power the framework’s webserver of your app are probably not relevant, however calls to the framework’s library once you start handling code likely are.

`vars`

: A mapping of variables which were available within this frame (usually context-locals).

The following attributes are primarily used for C-based languages:

`package`

: The “package” the frame was contained in. Depending on the platform this can be different things. For C# it can be the name of the assembly, for native code it can be the path of the dynamic library etc.

`platform`

: This can override the platform for a single frame. Otherwise the platform of the event is assumed.

`image_addr`

: Optionally an address of the debug image to reference. If this is set and a known image is defined by `debug_meta` then symbolication can take place.

`instruction_addr`

: An optional instruction address for symbolication. This should be a string as hexadecimal number with a `0x` prefix.

`symbol_addr`

: An optional address that points to a symbol. We actually use the instruction address for symbolication but this can be used to calculate an instruction offset automatically.

`instruction_offset`

: The difference between instruction address and symbol address in bytes.

```json
"stacktrace": {
  "frames": [{
    "abs_path": "/real/file/name.py",
    "filename": "file/name.py",
    "function": "myfunction",
    "vars": {
      "key": "value"
    },
    "pre_context": [
      "line1",
      "line2"
    ],
    "context_line": "line3",
    "lineno": 3,
    "in_app": true,
    "post_context": [
      "line4",
      "line5"
    ],
  }],
  "frames_omitted": [13, 56]
}
```

### Exception Mechanism Interface

The exception mechanism is an optional field residing in the [_Exception Interface_]({%- link _documentation/development/sdk-dev/interfaces/exception.md -%}). It carries additional information about the way the exception was created on the target system. This includes general exception values obtained from operating system or runtime APIs, as well as mechanism-specific values.

#### Attributes

`type`:

: required unique identifier of this mechanism determining rendering and processing of the mechanism data

`description`:

: optional human readable description of the error mechanism and a possible hint on how to solve this error

`help_link`:

: optional fully qualified URL to an online help resource, possible interpolated with error parameters

`handled`:

: optional flag indicating whether the exception has been handled by the user (e.g. via `try..catch`)

`meta`:

: optional information from the operating system or runtime on the exception mechanism (see below)

`data`:

: arbitrary extra data that might help the user understand the error thrown by this mechanism

{% capture __alert_content -%}
The `type` attribute is required to send any exception mechanism attribute, even if the SDK cannot determine the specific mechanism. In this case, set the `type` to `"generic"`. See below for an example.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

#### Meta information

The mechanism meta data usually carries error codes reported by the runtime or operating system, along with a platform dependent interpretation of these codes. SDKs can safely omit code names and descriptions for well known error codes, as it will be filled out by Sentry. For proprietary or vendor-specific error codes, adding these values will give additional information to the user.

The `meta` key may contain one or more of the following attributes:

##### `signal`

Information on the POSIX signal. On Apple systems, signals also carry a code in addition to the signal number describing the signal in more detail. On Linux, this code does not exist.

`number`:

: the POSIX signal number

`code`:

: optional Apple signal code

`name`:

: optional name of the signal based on the signal number

`code_name`:

: optional name of the signal code

##### `mach_exception`

A Mach Exception on Apple systems comprising a code triple and optional descriptions.

`exception`:

: required numeric exception number

`code`:

: required numeric exception code

`subcode`:

: required numeric exception subcode

`name`:

: optional name of the exception constant in iOS / macOS

##### `errno`

Error codes set by linux system calls and some library functions as specified in ISO C99, POSIX.1-2001 and POSIX.1-2008. See [errno(3)](http://man7.org/linux/man-pages/man3/errno.3.html) for more information.

`number`:

: the error number

`name`:

: optional name of the error

#### Examples

The following examples illustrate payloads that may be sent by SDKs in various circumstances.

##### iOS native mach exception

```json
{
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
```

##### JavaScript unhandled promise rejection

```json
{
    "type": "promise",
    "description": "This error originated either by throwing inside of an ...",
    "handled": false,
    "data": {
        "polyfill": "bluebird"
    }
}
```

##### Generic unhandled crash

```json
{
    "type": "generic",
    "handled": false
}
```

### Template Interface

This interface is useful for template engine specific reporting when regular stack traces do not contain template data. This for instance is required in the Django framework where the templates do not integrate into the Python stack trace.

A rendered template. This is generally used like a single frame in a stack trace and should only be used if the template system does not provide proper stack traces otherwise.

The attributes `filename`, `context_line`, and `lineno` are required.

`lineno`

: The line number of the call

`abs_path`

: The absolute path to the template on the file system

`filename`

: The filename as it was passed to the template loader

`context_line`

: Source code in filename at lineno

`pre_context`

: A list of source code lines before context_line (in order) – usually `[lineno - 5:lineno]`

`post_context`

: A list of source code lines after context_line (in order) – usually `[lineno + 1:lineno + 5]`

```json
"template": {
  "abs_path": "/real/file/name.html"
  "filename": "file/name.html",
  "pre_context": [
    "line1",
    "line2"
  ],
  "context_line": "line3",
  "lineno": 3,
  "post_context": [
    "line4",
    "line5"
  ],
}
```

## Scope

- [Breadcrumbs Interface]({%- link _documentation/development/sdk-dev/interfaces/breadcrumbs.md -%})
- [Contexts Interface]({%- link _documentation/development/sdk-dev/interfaces/contexts.md -%})
- [GPU Interface]({%- link _documentation/development/sdk-dev/interfaces/gpu.md -%})
- [HTTP Interface]({%- link _documentation/development/sdk-dev/interfaces/http.md -%})
- [Threads Interface]({%- link _documentation/development/sdk-dev/interfaces/threads.md -%})
- [User Interface]({%- link _documentation/development/sdk-dev/interfaces/user.md -%})

## Misc

- [Debug Interface]({%- link _documentation/development/sdk-dev/interfaces/debug.md -%})
- [SDK Interface]({%- link _documentation/development/sdk-dev/interfaces/sdk.md -%})

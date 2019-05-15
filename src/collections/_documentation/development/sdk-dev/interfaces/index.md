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

: an optional value which refers to a thread in the [_threads_](#threads-interface) interface.

`mechanism`:

: an optional object describing the [_mechanism_](#exception-mechanism-interface) that created this exception.

You can also optionally bind a [_stack trace interface_](#stack-trace-interface) to an exception.

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

### Stack Trace Interface

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

The exception mechanism is an optional field residing in the [_Exception Interface_](#exception-interface). It carries additional information about the way the exception was created on the target system. This includes general exception values obtained from operating system or runtime APIs, as well as mechanism-specific values.

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

### Breadcrumbs Interface

The breadcrumbs interface specifies a series of application events, or
“breadcrumbs”, that occurred before the main event. Its canonical name is
`"breadcrumbs"`.

This interface is an object with a sole `values` key containing an ordered list
of breadcrumb objects. The entries are ordered from oldest to newest.
Consequently, the last entry in the array should be the last entry before the
event occurred.

Each breadcrumb has a few properties of which at least `timestamp` and
`category` must be provided. The rest is optional and depending on what is
provided the rendering might be different:

`timestamp`

: **Required**. A timestamp representing when the breadcrumb occurred. This can
be either an ISO datetime string, or a Unix timestamp.

`type`

: _Optional_. The type of breadcrumb. The default type is `default` which
indicates no specific handling. Other types are currently `http` for HTTP
requests and `navigation` for navigation events. More about types later.

`category`

: _Optional_. A dotted string indicating what the crumb is or where it comes
from. Typically it is a module name or a descriptive string. For instance,
_ui.click_ could be used to indicate that a click happend in the UI or _flask_
could be used to indicate that the event originated in the Flask framework.

`message`

: _Optional_. If a message is provided it is rendered as text with all
whitespace preserved. Very long text might be truncated in the UI.

`data`

: _Optional_. Arbitrary data associated with this breadcrumb. Contains a
dictionary whose contents depend on the breadcrumb `type`. See descriptions of
breadcrumb types below. Additional parameters that are unsupported by the type
are rendered as a key/value table.

`level`

: _Optional_. This defines the severity level of the breadcrumb. Allowed values
are, from highest to lowest: `fatal`, `error`, `warning`, `info` and `debug`.
Levels are used in the UI to emphasize and deemphasize the crumb. Defaults to
`info`.

#### Examples

```json
"breadcrumbs": {
  "values": [
    {
      "timestamp": 1461185753845,
      "message": "Something happened",
      "category": "log",
      "data": {
        "foo": "bar",
        "blub": "blah"
      }
    },
    {
      "timestamp": "2016-04-20T20:55:53.847Z",
      "type": "navigation",
      "data": {
        "from": "/login",
        "to": "/dashboard"
      }
    }
  ]
}
```

#### Breadcrumb Types

Below are descriptions of individual breadcrumb types, and what their `data`
properties look like.

##### `default`

Describes an generic breadcrumb. This is typically a log message or user
generated breadcrumb. The `data` part is entirely undefined and as such
completely rendered as a key/value table.

```json
{
  "timestamp": 1461185753845,
  "message": "Something happened",
  "category": "log",
  "data": {
    "key": "value"
  }
}
```

##### `navigation`

Describes a navigation breadcrumb. A navigation event can be a URL change in a
web application, or a UI transition in a mobile or desktop application, etc.

Its `data` property has the following sub-properties:

`from`

: **Required**. A string representing the original application state / location.

`to`

: **Required**. A string representing the new application state / location.

```json
{
  "timestamp": 1461185753845,
  "type": "navigation",
  "data": {
    "from": "/login",
    "to": "/dashboard"
  }
}
```

##### `http`

Describes an HTTP request breadcrumb. This represents an HTTP request
transmitted from your application. This could be an AJAX request from a web
application, or a server-to-server HTTP request to an API service provider, etc.

Its `data` property has the following sub-properties:

`url`

: _Optional_. The request URL.

`method`

: _Optional_. The HTTP request method.

`status_code`

: _Optional_. The HTTP status code of the response.

`reason`

: _Optional_. A text that describes the status code.

```json
{
  "timestamp": 1461185753845,
  "type": "http",
  "data": {
    "url": "http://example.com/api/1.0/users",
    "method": "GET",
    "status_code": 200,
    "reason": "OK"
  }
}
```

### Contexts Interface

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

#### Context Types

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

### GPU Interface

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

#### Example

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

### HTTP Interface

The Request information is stored in the HTTP interface. Two arguments are required: url and `method`.

The `env` variable is a compounded dictionary of HTTP headers as well as environment information passed from the webserver. Sentry will explicitly look for `REMOTE_ADDR` in `env` for things which require an IP address.

The data variable should only contain the request body (not the query string). It can either be a dictionary (for standard HTTP requests) or a raw request body.

`url`

: The full URL of the request if available.

`method`

: The actual HTTP method of the request.

`data`

: Submitted data in whatever format makes most sense. SDKs should discard large bodies by default.

`query_string`

: The unparsed query string as it is provided.

`cookies`

: The cookie values. Typically unparsed as a string.

`headers`

: A dictionary of submitted headers. If a header appears multiple times it needs to be merged according to the HTTP standard for header merging.

`env`

: Optional environment data. This is where information such as CGI/WSGI/Rack keys go that are not HTTP headers.

```json
"request": {
  "url": "http://absolute.uri/foo",
  "method": "POST",
  "data": {
    "foo": "bar"
  },
  "query_string": "hello=world",
  "cookies": "foo=bar",
  "headers": {
    "Content-Type": "text/html"
  },
  "env": {
    "REMOTE_ADDR": "192.168.0.1"
  }
}
```

### Threads Interface

The threads interface allows you to specify the threads there were running at the time an event happened. These threads can also contain stack traces. As per policy the thread that actually crashed with an exception should not have a stack trace but instead the `thread_id` attribute should be set on the exception and Sentry will connect the two.

This interface supports multiple thread values in the `values` key. The following attributes are known for each value:

`stacktrace`:

: You can also optionally bind a [_stack trace_](#stack-trace-interface) to the thread.

`id`:

: The ID of the thread. Typically an integer or short string. Needs to be unique among the threads. An exception can set the `thread_id` attribute to cross reference this thread.

`crashed`:

: An optional bool to indicate that the thread crashed.

`current`:

: An optional bool to indicate that the thread was in the foreground.

`name`:

: an optional thread name.

```json
"threads": {
  "values": [{
    "id": "0",
    "name": "main",
    "crashed": true,
    "stacktrace": {...}
}
```

### User Interface

An interface which describes the authenticated User for a request.

You should provide at least either an `id` (a unique identifier for an authenticated user) or `ip_address` (their IP address).

`id`

: The unique ID of the user.

`email`

: The email address of the user.

`ip_address`

: The IP of the user.

`username`

: The username of the user

All other keys are stored as extra information but not specifically processed by sentry.

```json
"user": {
  "id": "unique_id",
  "username": "my_user",
  "email": "foo@example.com",
  "ip_address": "127.0.0.1",
  "subscription": "basic"
}
```

## Misc

### Debug Interface

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

### SDK Interface

An interface which describes the SDK and its configuration used to capture and
transmit the event.

`name`

: **Required**. The name of the SDK. Its format is `sentry.ecosystem[.flavor]`
where the _flavor_ is optional and should only be set if it has its own SDK.

`version`

: **Required**. The semantic version of the SDK. The version should always be
sent without a `v` prefix.

`integrations`

: _Optional_. A list of integrations with the platform or a framework that were
explicitly actived by the user. This does not include default integrations.

`packages`

: _Optional_. A list of packages that were installed as part of this SDK or the
activated integrations. Each package consists of a `name` in the format
`source:identifier` and a semver `version`. If the source is a git repository,
a checkout link and git reference (branch, tag or sha) should be used.

#### Example

```json
"sdk": {
  "name": "sentry.javscript.react-native",
  "version": "1.0.0",
  "integrations": [
    "redux"
  ],
  "packages": [
    {
      "name": "npm:@sentry/react-native",
      "version": "0.39.0"
    },
    {
      "name": "git:https://github.com/getsentry/sentry-cocoa.git",
      "version": "4.1.0"
    }
  ]
}
```

---
title: Native
---

The Sentry Native SDK is intended for C and C++. However, since it builds as a
dynamic library and exposes C-bindings, it can be used by any language that
supports interoperability with C, such as the Foreign Function Interface (FFI).

Sentry also offers higher-level SDKs for platforms with built-in support for
native crashes:

- [_Android_](/platforms/android/)
- [_Cocoa_](/clients/cocoa/)
- [_Electron_](/platforms/javascript/electron/)

In case you would like to use Sentry with a third-party framework directly
without using the Native SDK, see the following resources:

- [_Google Breakpad_](/platforms/native/breakpad/)
- [_Google Crashpad_](/platforms/native/crashpad/)
- [_Unreal Engine 4_](/platforms/native/ue4/)

The Sentry Native SDK has built-in support for both Google Breakpad and Google
Crashpad, see the [Integrations](#integrations) below.

## Integrating the SDK

The Native SDK currently supports **Windows**, **macOS**, **Linux**, and **Android**.

### Building the SDK

To build the SDK, download the latest release of the SDK from the [Releases
page](https://github.com/getsentry/sentry-native/releases).
The SDK is managed as a [CMake] project, which additionally supports several configuration options, such as the backend to use.

For example, `CMake` can be used like this (on macOS):

```sh
# configure the cmake build into the `build` directory, with crashpad (on macOS)
$ cmake -B build -D SENTRY_BACKEND=crashpad
# build the project
$ cmake --build build --parallel
# install the resulting artifacts into a specific prefix
$ cmake --install build --prefix install
# which will result in the following (on macOS):
$ exa --tree install
install
├── bin
│  └── crashpad_handler
├── include
│  └── sentry.h
└── lib
   ├── libsentry.dylib
   └── libsentry.dylib.dSYM
```

[cmake]: https://cmake.org/cmake/help/latest/

### Connecting the SDK to Sentry

After completing the project setup in Sentry, it shows the _Data Source Name_
(DSN). It looks similar to a standard URL, and contains all configuration for
the SDK.

Import and initialize the Sentry SDK early in your application setup:

```c
#include <sentry.h>

int main(void) {
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_dsn(options, "___PUBLIC_DSN___");
  sentry_init(options);

  /* ... */

  // make sure everything flushes
  sentry_shutdown();
}
```

{% capture __alert_content -%}
Calling `sentry_shutdown()` before exiting the application is critical. It
ensures that events can be sent to Sentry before execution stops. Otherwise,
event data may be lost.
{%- endcapture -%}
{%- include components/alert.html
  title="Warning"
  content=__alert_content
  level="warning"
%}

Alternatively, the DSN can be passed as `SENTRY_DSN` environment variable during
runtime. This can be especially useful for server applications.

### Verifying Your Setup

Now that SDK setup is complete, verify that all configuration is correct. Start
by capturing a manual event:

```c
sentry_capture_event(sentry_value_new_message_event(
  /*   level */ SENTRY_LEVEL_INFO,
  /*  logger */ "custom",
  /* message */ "It works!"
));
```

Once the event is captured, it will show up on the Sentry dashboard.

## Capturing Events

The Native SDK exposes a _Value API_ to construct values like Exceptions, User
objects, Tags, and even entire Events. There are several ways to create an
event.

### Manual Events

To create and capture a manual event, follow these steps:

1. Create an event value using `sentry_value_new_event`. This internally
   creates an object value and initializes it with common event attributes, like
   a `timestamp` and `event_id`.
2. Add custom attributes to the event, like a `message` or an `exception`.
3. Send the event to Sentry by invoking `sentry_capture_event`.

In a more complex example, it looks like this:

```c
sentry_value_t event = sentry_value_new_event();
sentry_value_set_by_key(event, "message", sentry_value_new_string("Hello!"));

sentry_value_t screen = sentry_value_new_object();
sentry_value_set_by_key(screen, "width", sentry_value_new_int32(1920));
sentry_value_set_by_key(screen, "height", sentry_value_new_int32(1080));

sentry_value_t extra = sentry_value_new_object();
sentry_value_set_by_key(extra, "screen_size", screen);

sentry_value_set_by_key(event, "extra", extra);
sentry_capture_event(event);
```

For the full list of supported values, see [_Event Payloads_](https://develop.sentry.dev/sdk/event-payloads/) and linked
documents.

### Exceptions

To capture an error or exception condition, create events containing an
exception object. It needs to contain at least a value and type:

```c
#include <sentry.h>

sentry_value_t exc = sentry_value_new_object();
sentry_value_set_by_key(exc, "type", sentry_value_new_string("Exception"));
sentry_value_set_by_key(exc, "value", sentry_value_new_string("Error message."));

sentry_value_t event = sentry_value_new_event();
sentry_value_set_by_key(event, "exception", exc);
sentry_capture_event(event);
```

This exception does not contain a stack trace, which must be added separately.

### Message Events

To simplify creating events, there are shorthand functions that construct
prepopulated event objects. The most important one is
`sentry_value_new_message_event`. The `logger` and `message` parameters are each
optional.

```c
sentry_value_t event = sentry_value_new_message_event(
  /*   level */ SENTRY_LEVEL_INFO,
  /*  logger */ "custom",
  /* message */ "It works!"
);
```

## Uploading Debug Information

{% include platforms/upload-debug-info.md %}

## Releases

{% include platforms/configure-releases.md %}

To configure the SDK to send release information, set the release during
initialization:

```c
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_release(options, "my-unique-release-1.0.0");
```

## Context

{% include platforms/event-contexts.md %}

Context information is attached to every event until explicitly removed or
overwritten.

### Extra Context

In addition to the structured contexts that Sentry understands, you can send
arbitrary key/value pairs of data which the Sentry SDK will store alongside the
event. These are not indexed, and the Sentry SDK uses them to add additional
information about what might be happening.

`sentry_set_extra` takes the name of the extra value as first parameter, and the
value as `sentry_value_t` as second parameter:

```c
sentry_value_t screen = sentry_value_new_object();
sentry_value_set_by_key(screen, "width", sentry_value_new_int32(1920));
sentry_value_set_by_key(screen, "height", sentry_value_new_int32(1080));
sentry_set_extra("screen_size", screen);
```

### Capturing the User

Sending users to Sentry will unlock many features, primarily the ability to
drill down into the number of users affecting an issue, as well as to get a
broader sense about the quality of the application.

```c
sentry_value_t user = sentry_value_new_object();
sentry_value_set_by_key(user, "id", sentry_value_new_int32(42));
sentry_value_set_by_key(user, "username", sentry_value_new_string("John Doe"));
sentry_set_user(user);
```

{% include platforms/user-attributes.md %}

### Tagging Events

Tags are key/value pairs assigned to events that can be used for breaking down
issues or quick access to finding related events.

```c
sentry_set_tag("server_name", "caroline");
```

For more information, see the [Tagging Events section](/enriching-error-data/additional-data/#tags) in Context.

### Setting the Level

You can set the severity of an event to one of five values (sorted from most
severe to least severe): `fatal`, `error`, `warning`, `info`, and `debug`. The
default level is `error`.

```c
sentry_set_level(SENTRY_LEVEL_WARNING);
```

### Setting the Fingerprint

{% include platforms/fingerprints.md %}

## Advanced Usage

### Advanced Configuration

The Native SDK sets the options when you first initialize the SDK:

```c
sentry_options_t *options = sentry_options_new();

sentry_options_set_environment(options, "Production");
sentry_options_set_release(options, "5fd7a6cd");
sentry_options_set_debug(options, 1);

sentry_init(options);
```

For more information, see:

- [Sentry’s complete list of Common Options across SDKs](/error-reporting/configuration/)
- [Full documentation on Environments](/enriching-error-data/environments/)

### Breadcrumbs

To receive more information on actions leading up to an exception or crash, the
SDK can record breadcrumbs that are automatically added to every event. The most
recent breadcrumbs are kept in a buffer.

You can manually add breadcrumbs using `sentry_add_breadcrumb`:

```c
#include <sentry.h>

sentry_value_t crumb = sentry_value_new_breadcrumb("default", "Authenticated user");
sentry_value_set_by_key(crumb, "category", sentry_value_new_string("auth"));
sentry_value_set_by_key(crumb, "level", sentry_value_new_string("info"));
sentry_add_breadcrumb(crumb);
```

For more information, see:

- [Full documentation on Breadcrumbs](/enriching-error-data/breadcrumbs/)
- [Debug Issues Faster with
  Breadcrumbs](https://blog.sentry.io/2016/05/04/breadcrumbs).

### Filter Events & Custom Logic

Sentry exposes a `before_send` callback which can be used to filter out
information or add additional context to the event object. The callback must
conform to the `sentry_event_function_t` signature.

```c
#include <sentry.h>

sentry_value_t strip_sensitive_data(sentry_value_t event, void *hint) {
  /* modify event here or return NULL to discard the event */
  return event;
}

int main(void) {
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_before_send(options, strip_sensitive_data);
  sentry_init(options);

  /* ... */
}
```

The callback is executed in the same thread as the call to
`sentry_capture_event`. Work performed by the function may thus block the
executing thread. For this reason, consider avoiding heavy work in
`before_send`.

For more information, see:

- [Full documentation on Filtering Events](/error-reporting/configuration/filtering/)
- [Manage Your Flow of Errors Using Inbound
  Filters](https://blog.sentry.io/2017/11/27/setting-up-inbound-filters).

{% capture __alert_content -%}
The Crashpad Backend sends minidumps with an additional event payload
out-of-process. `before_send` hooks are not invoked when capturing crashes
using Crashpad.
{%- endcapture -%}
{%- include components/alert.html
  title="Crashpad Notice"
  content=__alert_content
  level="warning"
%}

### Transports

The Native SDK uses _Transports_ to send event payloads to Sentry. The default
transport depends on the target platform:

 - **Windows**: WinHTTP
 - **Linux**: Curl
 - **macOS**: Curl

To specify a custom transport, use the `sentry_options_set_transport` function
and supply a transport that implements the `sentry_transport_t` interface.

```c
#include <sentry.h>

void custom_transport(sentry_envelope_t *envelope, void *state) {
  /*
   * Send the event here. If the transport requires state, such as an HTTP
   * client object or request queue, it can be specified in the `state`
   * parameter when configuring the transport. It will be passed as second
   * argument to this function.
   * The transport takes ownership of the `envelope`, and must free it once it
   * is done.
   */
  sentry_envelope_free(envelope);
}

int main(void) {
  void *transport_state = 0;

  sentry_options_t *options = sentry_options_new();
  sentry_transport_t *transport = sentry_transport_new(custom_transport);
  sentry_transport_set_state(transport, transport_state);
  
  sentry_options_set_transport(options, transport);
  sentry_init(options);

  /* ... */
}
```

The transport is invoked in the same thread as the call to
`sentry_capture_event`. Consider to offload network communication to a
background thread or thread pool to avoid blocking execution.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks
and libraries. Similar to plugins, they extend the functionality of the Sentry
SDK.

The Native SDK can use different backends that are responsible for capturing
crashes. The backend is configured at build-time, using the `SENTRY_BACKEND`
CMake option, with support for the following options:

- `crashpad`, which is the default on Windows and macOS,
- `breakpad`, which is the default on Linux,
- `inproc`, the default on Android, and
- `none`, that disables capturing crashes altogether.

### Google Crashpad

[Crashpad](https://chromium.googlesource.com/crashpad/crashpad/+/master/README.md)
is an open-source multiplatform crash reporting system written in C++ by Google.
It supports macOS, Windows, and Linux, and features an uploader to
submit minidumps to a configured URL right when the process crashes.

To use the Crashpad backend with the Native SDK, configure the CMake build
with the `SENTRY_BACKEND=crashpad` option. This will automatically create a
`crashpad_handler` executable alongside the `sentry` library.

```sh
$ cmake -B build -D SENTRY_BACKEND=crashpad
```

The SDK will automatically look for a `crashpad_handler` executable in the same
directory as the running application. It will also use the `.sentry-native`
directory as its database by default, relative to the current working directory
of your application.
This location temporarily hosts Minidumps before they are uploaded to Sentry.

Both of these paths can be customized like this:

```c
sentry_options_t *options = sentry_options_new();
sentry_options_set_handler_path(options, "path/to/crashpad_handler");
sentry_options_set_database_path(options, "sentry-db-directory");
sentry_init(options);
```

The crashpad handler executable must be shipped alongside your application so
that it can be launched when initializing the SDK. The path is evaluated
according to shell lookup rules at runtime.

It is advised to specify both the path to the `crashpad_handler` executable
as well as the path to the database directory manually.

## Event Attachments (Preview)

Besides the Minidump file, Sentry can optionally store additional files uploaded
in the same request, such as log files.

{% include platforms/event-attachments.md %}

To add an attachment, the path to the file has to be configured when
initializing the SDK. It will monitor the file and upload it along with any event
or crash that is sent to Sentry:

```c
sentry_options_add_attachment(options, "/var/server.log");
```

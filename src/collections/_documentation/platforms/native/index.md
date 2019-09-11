---
title: Native
---

The Sentry Native SDK is intended for C and C++. However, since it builds as a
dynamic library and exposes C-bindings, it can be used by any language that
supports interoperability with C, such as the Foreign Function Interface (FFI).

Sentry also offers higher-level SDKs for platofmrs with built-in support for
native crashes:

- [_Cocoa_]({%- link _documentation/clients/cocoa/index.md -%})
- [_Electron_]({%- link _documentation/platforms/javascript/electron.md -%})

In case you would like to integrate Sentry into a third-party framework directly
without using the Native SDK, see the following resources:

- [_Google Breakpad_]({%- link _documentation/platforms/native/breakpad.md -%})
- [_Google Crashpad_]({%- link _documentation/platforms/native/crashpad.md -%})
- [_Unreal Engine 4_]({%- link _documentation/platforms/native/ue4.md -%})

## Integrating the SDK

The Native SDK currently supports **Windows, macOS and Linux**. There are three
flavors to choose from:

| Standalone       | With Breakpad   | With Crashpad   |
|------------------|-----------------|-----------------|
| Custom Messages  | Custom Messages | Custom Messages |
| Custom Errors    | Custom Errors   | Custom Errors   |
| Breadcrumbs      | Breadcrumbs     | Breadcrumbs     |
| Stack Traces*    | Stack Traces    | Stack Traces    |
| Capture Crashes* | Capture Crashes | Capture Crashes |
|                  | Minidumps       | Minidumps       |
|                  | Attachments     | Attachments     |

> \* Adding stack traces and capturing application crashes requires to add an
  unwind library and hook into signal handlers of your process. The Standalone
  version currently does not contain integrations that perform this
  automatically.

### Building the SDK

To build the SDK, download the latest release of the SDK from the [Releases
page](https://github.com/getsentry/sentry-native/releases). For each supported
platform, there is a `gen_*` subfolder that contains build files:

**Windows**

: A Microsoft Visual Studio 2017 solution. Open the solution and
  add your own projects or copy the projects to an existing solution. Each
  project supports a debug and release configuration and includes all sources
  required for building.

**Linux and macOS**

: Makefiles that can be used to produce dynamic libraries. Run `make help` to
  see an overview over the available configurations and target. There are a
  debug and release configuration, that can be toggled when building:
  
  ```bash
  make -j4 config=release sentry
  ```

There are multiple available targets to build:

 - `sentry`: Builds the Native SDK built as dynamic library.
 - `sentry_breakpad`: Builds the Native SDK with Google Breakpad as dynamic
   library. 
 - `sentry_crashpad`: Builds the Native SDK with Google Crashpad as dynamic
   library. 
 - `crashpad_*`: Builds crashpad utilities. In order to run the Crashpad version
   of the SDK, at least `crashpad_handler` has to be built.


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
}
```

Alternatively, the DSN can be passed as `SENTRY_DSN` environment variable when
running the application. This can be especially useful for server applications.

### Verifying Your Setup

Now that SDK setup is complete, verify that all configuration is correct. Start
by capturing a manual event:

```c
sentry_value_t event = sentry_value_new_event();
sentry_value_set_by_key(event, "message", sentry_value_new_string("Hello!"));
sentry_capture_event(event);
```

Once the event is captured, it will show up on the Sentry dashboard.

## Capturing Events

The Native SDK exposes a _Value API_ to construct values like Exceptions, User
objects, Tags, and even entire Events. To capture an event, follow these steps:

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

For the full list of supported values, see [_Event Payloads_]({%- link
_documentation/development/sdk-dev/event-payloads/index.md -%}) and linked
documents.

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

For more information, see the [Tagging Events section]({%- link _documentation/enriching-error-data/context.md -%}#tagging-events) in Context.

### Setting the Level

You can set the severity of an event to one of five values: `fatal`, `error`,
`warning`, `info`, and `debug`. The default level is error, fatal is the most
severe, and debug is the least severe.

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

- [Sentry’s complete list of Common Options across SDKs]({%- link
  _documentation/error-reporting/configuration/index.md -%})
- [Full documentation on Environments]({%- link
  _documentation/enriching-error-data/environments.md -%})

### Breadcrumbs

To receive more information on actions leading up to an exception or crash, the
SDK can record breadcrumbs that are automatically added to every event. A number
of the most recent breadcrumbs is kept.

You can manually add breadcrumbs using `sentry_add_breadcrumb`:

```python
sentry_value_t crumb = sentry_value_new_breadcrumb("http", "debug crumb");
sentry_value_set_by_key(crumb, "category", sentry_value_new_string("example"));
sentry_value_set_by_key(crumb, "level", sentry_value_new_string("debug"));
sentry_add_breadcrumb(crumb);
```

For more information, see:

- [Full documentation on Breadcrumbs]({%- link
  _documentation/enriching-error-data/breadcrumbs.md -%})
- [Debug Issues Faster with
  Breadcrumbs](https://blog.sentry.io/2016/05/04/breadcrumbs).

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks
and libraries. Similar to plugins, they extend the functionality of the Sentry
SDK. The Native SDK comes in two additional flavors that include integrations
into the Breakpad and Crashpad libraries, respectively.

### Breakpad

[Breakpad](https://chromium.googlesource.com/breakpad/breakpad/) is an
open-source multiplatform crash reporting system written in C++ by Google and
the predecessor of Crashpad. It supports macOS, Windows and Linux, and features
an uploader to submit minidumps to a configured URL right when the process
crashes.

To use the Breakpad integration with the Native SDK, build and link the
`sentry_breakpad` dynamic library. Then, configure a path at which breakpad can
store its database. This location temporarily hosts Minidumps before they are
uploaded to Sentry.

```c
sentry_options_t *options = sentry_options_new();
sentry_options_set_database_path(options, "sentry-db");
sentry_init(options);
```

### Crashpad

[Crashpad](https://chromium.googlesource.com/crashpad/crashpad/+/master/README.md)
is an open-source multiplatform crash reporting system written in C++ by Google.
It supports macOS, Windows and Linux (limited), and features an uploader to
submit minidumps to a configured URL right when the process crashes.

To use the Crashpad integration with the Native SDK, build and link the
`sentry_crashpad` dynamic library. Additonally, build the standalone
`crashpad_handler` application. Then, configure a path at which breakpad can
store its database. This location temporarily hosts Minidumps before they are
uploaded to Sentry.

```c
sentry_options_t *options = sentry_options_new();
sentry_options_set_handler_path(options, handler_path);
sentry_options_set_database_path(options, "sentry-db");
sentry_init(options);
```

### Event Attachments (Preview)

Besides the Minidump file, Sentry can optionally store additional files uploaded
in the same request, such as log files.

{% include platforms/event-attachments.md %}

Attachments are only supported when using the Breakpad or Crashpad version of
the SDK. To add an attachment, the path to the file has to be configured when
initializing the SDK. It will monitor the file and add it to any Minidump that
is sent to Sentry:

```c
sentry_options_add_attachment(options, "log", "/var/server.log");
```

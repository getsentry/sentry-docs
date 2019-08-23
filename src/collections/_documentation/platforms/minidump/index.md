---
title: Minidump
---

Sentry can process Minidump crash reports, a memory dump used on Windows and by open-source libraries like [_Breakpad_]({%- link _documentation/platforms/minidump/breakpad.md -%}) or [_Crashpad_]({%- link _documentation/platforms/minidump/crashpad.md -%}). You can either choose to generate and upload minidumps yourself or use a higher-level SDK for platforms with built-in support for native crashes:

-   [_Cocoa_]({%- link _documentation/clients/cocoa/index.md -%})
-   [_Electron_]({%- link _documentation/platforms/javascript/electron.md -%})
-   [_Unreal Engine 4_]({%- link _documentation/platforms/unrealengine/index.md -%})

In order to receive symbolicated stack traces, you have to upload debug information to Sentry. For more information, see [Uploading Debug Information](#minidump-dif).

<!-- WIZARD -->
## Platform and Language Support

Sentry currently supports minidumps for **Windows, macOS and Linux**. There is no limitation as to which programming language you can use. Sentry can also demangle symbols from the following languages:

-   C and C++
-   ObjectiveC and ObjectiveC++
-   Swift
-   Rust

Languages not listed above will show the mangled name instead.
<!-- ENDWIZARD -->

## What is a Minidump? {#what-is-a-minidump}

Minidumps are files containing the most important memory regions of a crashed process. When the process crashes, the minidump is written to the user’s disk and can later be uploaded to Sentry. A minidump typically includes:

-   The runtime stack of each thread that was active during the time of the crash. This allows to reconstruct stack traces for all stacks and even infer variable values in some cases.
-   Thread contexts, i.e. register values, at the time of the crash. This is especially relevant for stackwalking.
-   Optionally, the process heap. By default, this is not included in order to keep minidumps at a reasonable size. Sentry does not read the heap, so it can be safely omitted.
-   The crash reason and an optional memory address associated to it, e.g. for memory access violations. In case of assertions, the assertion message is also included in the dump.
-   Meta data about the CPU architecture and the user’s operating system.

{% capture __alert_content -%}
Minidumps are memory dumps of the process at the moment it crashes. As such, they might contain sensitive information on the target system, such as environment variables, local path names or maybe even in-memory representations of input fields including passwords. **Sentry does not store these memory dumps**. Once processed, they are removed immediately and all sensitive information is stripped from the resulting issues.
{%- endcapture -%}
{%- include components/alert.html
  title="A Word on Data Privacy"
  content=__alert_content
%}

In addition to this information, you can add further meta data specific to Sentry, which can help in organizing and analyzing issues. For more information, see [Passing Additional Data](#minidump-additional).

<!-- WIZARD -->
## Creating and Uploading Minidumps {#minidump-integration}

Depending on your operating system and programming language, there are various alternatives to create minidumps and upload them to Sentry. See the following resources for libraries that support generating minidump crash reports:

-   [Google Breakpad]({%- link _documentation/platforms/minidump/breakpad.md -%})
-   [Google Crashpad]({%- link _documentation/platforms/minidump/crashpad.md -%})

If you have already integrated a library that generates minidumps and would just like to upload them to Sentry, you need to configure the _Minidump Endpoint URL_, which can be found at _Project Settings > Client Keys (DSN)_. This endpoint expects a `POST` request with the minidump in the `upload_file_minidump` field:

```bash
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp
```

To send additional information, simply add more form fields to this request. For a full description of fields accepted by Sentry, see [Passing Additional Data](#minidump-additional).
<!-- ENDWIZARD -->

## Passing Additional Data {#minidump-additional}

You can add more information to crash reports simply by adding more fields to the upload HTTP request. All these fields will be collected in the “Extra Data” section in Sentry:

```bash
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp \
  -F custom_field=value
```

Additionally, you can set all attributes corresponding to the Sentry event interface in a `sentry` field. This field either accepts JSON data or its values can be flattened with the bracket syntax. For example, to set the release and add a tag, send:

```bash
# As JSON
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp \
  -F 'sentry={"release":"1.2.3","tags":{"mytag":"value"}}'

# flattened
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp \
  -F 'sentry[release]=1.0.0' \
  -F 'sentry[tags][mytag]=value'
```

For the full list of supported values, see [_Event Payloads_]({%- link
_documentation/development/sdk-dev/event-payloads/index.md -%}) and linked
documents.

## Event Attachments (Preview)

Besides the minidump file, Sentry can optionally store additional files uploaded
in the same request, such as log files.

{% include platforms/event-attachments.md %}

To send attachments directly to Sentry, simply add more files to the multipart
form body. Note that the entire request must not exceed **20MB** in size. Sentry
will use the provided file names and mime types and list those files in the
_Event Attachments_ section at the bottom of the _Issue Details_ page:

```bash
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp \
  -F some_file=@some_file.txt \
  -F db_log=@db.log
```

## Uploading Debug Information {#minidump-dif}

{% include platforms/upload-debug-info.md %}

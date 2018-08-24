---
title: Minidump
sidebar_order: 8
---

Sentry can process Minidump crash reports, a memory dump used on Windows and by open-source libraries like [_Breakpad_]({%- link _documentation/clients/minidump/breakpad.md -%}) or [_Crashpad_]({%- link _documentation/clients/minidump/crashpad.md -%}). You can either choose to generate and upload minidumps yourself or use a higher-level SDK for platforms with built-in support for native crashes:

-   [_Cocoa_]({%- link _documentation/clients/cocoa/index.md -%})
-   [_Electron_]({%- link _documentation/clients/electron/index.md -%})

In order to receive symbolicated stack traces, you have to upload debug information to Sentry. For more information, see [Uploading Debug Information](#minidump-dif).

## Platform and Language Support

Minidumps are currently supported for **Windows, macOS and Linux**. There is no limitation as to which programming language can be used. Sentry can also demangle symbols from the following languages; other languages will show the mangled name instead:

-   C and C++
-   ObjectiveC and ObjectiveC++
-   Swift
-   Rust

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

## Creating and Uploading Minidumps {#minidump-integration}

Depending on your operating system and programming language, there are various alternatives to create minidumps and upload them to Sentry. See the following resources for libraries that support generating minidump crash reports:

-   [Google Breakpad]({%- link _documentation/clients/minidump/breakpad.md -%})
-   [Google Crashpad]({%- link _documentation/clients/minidump/crashpad.md -%})

If you have already integrated a library that generates minidumps and would just like to upload them to Sentry, you need to configure the _Minidump Endpoint URL_, which can be found at _Project Settings > Client Keys (DSN)_. This endpoint expects a `POST` request with the minidump in the `upload_file_minidump` field:

```bash
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp
```

To send additional information, simply add more form fields to this request. For a full description of fields accepted by Sentry, see [Passing Additional Data](#minidump-additional).

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

For the full list of supported attributes, see [Attributes]({%- link _documentation/clientdev/attributes.md -%}#attributes) and linked documents.

## Uploading Debug Information {#minidump-dif}

To allow Sentry to fully process native crashes and provide you with symbolicated stack traces, you need to upload _Debug Information Files_ (sometimes also referred to as _Debug Symbols_ or just _Symbols_). We recommend to upload debug information during your build or release process.

Note that you need to provide debug information for all libraries that you would like to receive symbolication for. This includes dependencies and operating system libraries. If you are not sure which files are required, go to _Project Settings > Processing Issues_, which shows a list of all required files and instructions to retrieve them.

For more information on uploading debug information and their supported formats, see [Debug Information Files]({%- link _documentation/learn/cli/dif.md -%}#sentry-cli-dif).

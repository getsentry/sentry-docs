---
title: Unreal Engine 4
---

Installation of a Sentry SDK is not required in order to capture the crashes of your
UE4 application or game. Sentry supports the *UE4 Crash Reporter*.

To integrate your UE4 game or application with Sentry, the following steps are required:

1. Include the *UE4 Crash Reporter* to your game or application.
2. Include Debug information in the crash reports.
3. Add the Sentry DSN to the relevant configuration file.
4. Upload your games symbols so Sentry can display function names and line numbers.
5. Optionally enable Event Attachments for your Sentry project.

Below we'll break down each step in detail.

## UE4 Crash reporter

The UE4 Crash Reporter is provided out of the box by Epic Games. It is able to collect relevant
information about the crash and send it to a service like Sentry to process.

Adding it to your game means that in case a crash happens, the following dialog is displayed
to the user:

![The UE4 Crash Reporter]({% asset ue4-crash-reporter.png @path %})

### Include the UE4 Crash Reporter

You can add the _Crash Report Client_ to your game in your *Project Settings*.

The simplest way is to search the option: `Crash Reporter`:

![Include UE4 Crash Reporter]({% asset ue4-include-crash-reporter.png @path %})

The option is located under *Project > Packaging* menu, then select *show advanced* followed by
checking the box for: `Include Crash Reporter`.

## Debug information

To get the most out of Sentry, crash reports are required to include debug information.
In order for Sentry to be able to process the crash report and translate
memory addresses to meaningful information like function names, module names
and line numbers, the crash itself must include debug information and also, [symbols need
to be uploaded to Sentry](#upload-debug-symbols).

### Include Debug Information

![Include Debug Files]({% asset ue4-include-debug-files.png @path %})

The option is also located under *Project > Packaging* menu, then select *show advanced* followed by
checking the box for: `Include Debug Files`.

## Add the Sentry DSN

Now that the *Crash Reporter* and *Debug Files* are included, UE4 needs to know where to send the
crash. For that, we add the Sentry *DSN* (Data Source Name) to game's configuration file. This will
include which project within Sentry you want to see the crashes arriving in real time.
That's accomplished by configuring the `CrashReportClient` in the *DefaultEngine.ini* file.

Edit the file:
> project-root\Config\DefaultEngine.ini

Add the configuration section:

```ini
[CrashReportClient]
CrashReportClientVersion=1.0
DataRouterUrl="___UNREAL_URL___"
```

{% capture __alert_content -%}
If a `[CrashReportClient]` section already exists, simply changing the value of `DataRouterUrl`
 is enough.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

## Upload Debug Symbols {#upload-debug-symbols}

{% include platforms/upload-debug-info.md %}

## Event Attachments (Preview)

The files within the crash uploaded to Sentry can be persisted using *Event Attachments*.
Unless *Event Attachments* is enabled, Sentry will only use the files to create the event and
subsequently will drop the files.

In order to keep the original log and context files, make sure to enable the *Event Attachments*
feature in your Sentry project.

{% include platforms/event-attachments.md %}

## Size Limits

Event ingestion imposes limits on the size of UE4 crash reports. These limits
are subject to future change and defined currently as:

- *20MB* for a compressed request
- *50MB* for the full crash report after decompression

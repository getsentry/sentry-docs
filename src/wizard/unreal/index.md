---
name: Unreal Engine
doc_link: https://docs.sentry.io/platforms/unreal/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

## Installation

Download the latest plugin sources from the [Releases page](https://github.com/getsentry/sentry-unreal/releases) and place it in the project's "Plugins" directory. On the next project launch, UE will prompt to build Sentry module.

After the successful build, in the editor navigate to the **Project Settings > Plugins > Code Plugins** menu and check whether the Sentry plugin is enabled.

To access the plugin API from within C++, add Sentry support to the build script (MyProject.build.cs):

```csharp
PublicDependencyModuleNames.AddRange(new string[] { ..., "Sentry" });
```

## Configuration

Access the Sentry configuration window by going to editor's menu: **Project Settings > Plugins > Sentry** and enter the following DSN:

```
___PUBLIC_DSN___
```

## Crash Reporter Client

For Windows and Mac, [Crash Reporter Client](/platforms/unreal/configuration/setup-crashreporter/) provided along with Unreal Engine has to be configured in order to capture errors automatically.

### Include the Unreal Engine Crash Reporter

You can add the crash reporter client to your game in **Project Settings**.

The option is located under **Project > Packaging**; select "show advanced" followed by
checking the box for "Include Crash Reporter".

### Debug Information

To get the most out of Sentry, crash reports must include debug information.
In order for Sentry to be able to process the crash report and translate
memory addresses to meaningful information like function names, module names,
and line numbers, the crash itself must include debug information. In addition, symbols need
to be uploaded to Sentry.

The option is also located under **Project > Packaging**; select "show advanced" followed by
checking the box for "Include Debug Files".

### Configure the Crash Reporter Endpoint

Now that the crash reporter and debug files are included, UE4 needs to know where to send the
crash. For that, add the Sentry "Unreal Engine Endpoint" from the "Client Keys" settings page to the game's configuration file. This will
include which project in Sentry you want to see crashes displayed in.
That's accomplished by configuring the `CrashReportClient` in the _DefaultEngine.ini_ file. Changing the engine is necessary for this to work.

Edit the file:

> engine-dir\Engine\Programs\CrashReportClient\Config\DefaultEngine.ini

Add the configuration section:

```ini {filename:DefaultEngine.ini}
[CrashReportClient]
CrashReportClientVersion=1.0
DataRouterUrl="___UNREAL_URL___"
```

If a `[CrashReportClient]` section already exists, simply changing the value of `DataRouterUrl`
is enough.

### Upload Debug Symbols

To allow Sentry to fully process native crashes and provide you with
symbolicated stack traces, you need to upload _debug information files_
(sometimes also referred to as _debug symbols_ or just _symbols_). We recommend
uploading debug information during your build or release process.

For all libraries where you'd like to receive symbolication, **you need
to provide debug information**. This includes dependencies and operating system
libraries.

In addition to debug information files, Sentry needs _call frame information_
(CFI) to extract accurate stack traces from minidumps of optimized release
builds. CFI is usually part of the executables and not copied to debug symbols.
Unless you are uploading Breakpad symbols, be sure to also include the binaries
when uploading files to Sentry.

For more information on uploading debug information and their supported formats,
check out our [Debug Information Files documentation](/workflow/debug-files/).

## Verify

Once everything is configured you can call the plugin API from both C++ and blueprints:

```cpp
#include "SentrySubsystem.h"

void Verify()
{
    // Obtain reference to GameInstance
    UGameInstance* GameInstance = ...;

    // Capture message
    USentrySubsystem* SentrySubsystem = GameInstance->GetSubsystem<USentrySubsystem>();
    SentrySubsystem->CaptureMessage(TEXT("Capture message"));
}
```

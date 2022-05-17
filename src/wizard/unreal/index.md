---
name: Unreal Engine
doc_link: https://docs.sentry.io/platforms/unreal/
support_level: production
type: framework
---

## Installation

Download the latest plugin sources from the [Releases page](https://github.com/getsentry/sentry-unreal/releases) and place it in the project's `Plugins` directory. On the next project launch, UE will prompt to build Sentry module.

After the successful build, in the editor navigate to the Settings > Plugins > Code Plugins menu and check whether the Sentry plugin is enabled.

To access the plugin API from within C++, add Sentry support to the build script (MyProject.build.cs):

```csharp
PublicDependencyModuleNames.AddRange(new string[] { ..., "Sentry" });
```

## Configuration

Access the Sentry configuration window by going to editor's menu: `Project Settings` > `Plugins` > `Sentry` and enter the following DSN:

```
___PUBLIC_DSN___
```

## Crash Report Client

For Windows and Mac [Crash Report Client](/platforms/unreal/setup-crashreport/) provided along with Unreal Engine has to be configured in order to capture errors automatically.

### Include the UE4 Crash Reporter

You can add the _Crash Report Client_ to your game in your _Project Settings_.

The option is located under _Project > Packaging_ menu, then select _show advanced_ followed by
checking the box for: `Include Crash Reporter`.

### Debug information

To get the most out of Sentry, crash reports are required to include debug information.
In order for Sentry to be able to process the crash report and translate
memory addresses to meaningful information like function names, module names
and line numbers, the crash itself must include debug information and also, [symbols need
to be uploaded to Sentry](#upload-debug-symbols).

The option is also located under _Project > Packaging_ menu, then select _show advanced_ followed by
checking the box for: `Include Debug Files`.

### Configure the Crash Reporter Endpoint

Now that the _Crash Reporter_ and _Debug Files_ are included, UE4 needs to know where to send the
crash. For that, we add the Sentry _Unreal Engine Endpoint_ from the _Client Keys_ settings page to game's configuration file. This will
include which project within Sentry you want to see the crashes arriving in real time.
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

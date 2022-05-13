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

<Alert level="warning" title="Warning">

For Windows and Mac [Crash Report Client](/platforms/unreal/setup-crashreport/) provided along with Unreal Engine has to be configured in order to capture errors automatically.

</Alert>

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

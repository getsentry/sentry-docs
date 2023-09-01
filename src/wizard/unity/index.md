---
name: Unity
doc_link: https://docs.sentry.io/platforms/unity/
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

Install the package via the [Unity Package Manager using a Git URL](https://docs.unity3d.com/Manual/upm-ui-giturl.html) to Sentry's SDK repository:

```
https://github.com/getsentry/unity.git#{{@inject packages.version('sentry.dotnet.unity', '0.1.0') }}
```

## Configuration

> The Unity SDK now supports line numbers for IL2CPP. The feature is currently in beta, but you can enable it at `Tools -> Sentry -> Advanced -> IL2CPP line numbers`. To learn more check out our [docs](https://docs.sentry.io/platforms/unity/configuration/il2cpp/).

Access the Sentry configuration window by going to Unity's top menu: `Tools` > `Sentry` and enter the following DSN:

```
___PUBLIC_DSN___
```

And that's it! Now Sentry can capture errors automatically.

If you like additional contexts you could enable [Screenshots](https://docs.sentry.io/platforms/unity/enriching-events/screenshots/).

## Verify

Once it is configured with the DSN you can call the SDK from anywhere:

```csharp
using Sentry; // On the top of the script

SentrySdk.CaptureMessage("Test event");
```

## Troubleshooting

Confirm the URL doesn't have a trailing whitespace at the end. The Unity Package Manager will fail to find the package if a trailing whitespace is appended.

If you're running into any kind of issue please check out our [troubleshooting page](https://docs.sentry.io/platforms/unity/troubleshooting/) or [raise an issue](https://github.com/getsentry/sentry-unity/issues/new?assignees=&labels=Platform%3A+Unity%2CType%3A+Bug&template=bug.md).

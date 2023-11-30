---
name: Google Cloud Functions (.NET)
doc_link: https://docs.sentry.io/platforms/dotnet/guides/google-cloud-functions/
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

Install the **NuGet** package:

Package Manager:

```powershell {tabTitle:Package Manager}
Install-Package Sentry.Google.Cloud.Functions -Version {{@inject packages.version('sentry.dotnet.google-cloud-function') }}
```

```shell {tabTitle:.NET Core CLI}
dotnet add package Sentry.Google.Cloud.Functions -v {{@inject packages.version('sentry.dotnet.google-cloud-function') }}
```

Or, manually add the Sentry dependency into your csproj file:

```xml {tabTitle:project.csproj}
  <ItemGroup>
    <PackageReference Include="Sentry.Google.Cloud.Functions" Version="{{@inject packages.version('sentry.dotnet.google-cloud-function') }}"/>
  </ItemGroup>
```

Then, add Sentry to the `Function` class through `FunctionsStartup`:

```csharp
// Add the following line:
[assembly: FunctionsStartup(typeof(SentryStartup))]

public class Function : IHttpFunction
{
    public Task HandleAsync(HttpContext context)
    {
        // Your function code here.
    }
}
```

Additionally, you'll need to set up your `Sentry` settings on `appsettings.json`:

```json
{
  "Sentry": {
    "Dsn": "___PUBLIC_DSN___",
    // Sends Cookies, User Id when one is logged on and user IP address to sentry. It's turned off by default.
    "SendDefaultPii": true,
    // When configuring for the first time, to see what the SDK is doing:
    "Debug": true,
    // Opt-in for payload submission.
    "MaxRequestBodySize": "Always",
    // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    "TracesSampleRate": 1
  }
}
```

## Verify

To verify your setup, you can capture a message with the SDK:

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Sentry;

public Task HandleAsync(HttpContext context)
{
    SentrySdk.CaptureMessage("Hello Sentry");
}
```

## Samples

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Google Cloud Functions sample](https://github.com/getsentry/sentry-dotnet/tree/main/samples/Sentry.Samples.Google.Cloud.Functions)
- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)

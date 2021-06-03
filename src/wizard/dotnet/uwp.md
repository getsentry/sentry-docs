---
name: WP
doc_link: https://docs.sentry.io/platforms/dotnet/guides/uwp/
support_level: production
type: language
---

## Install the NuGet package

```shell
# Using Package Manager
Install-Package Sentry -Version {{ packages.version('sentry.dotnet') }}

# Or using .NET Core CLI
dotnet add package Sentry -v {{ packages.version('sentry.dotnet') }}
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

## Initialize the SDK

Initialize the SDK as early as possible, like in the constructor of the `App`:

```csharp
using System.Windows;
using Sentry;

sealed partial class App : Application
{
    protected override void OnLaunched(LaunchActivatedEventArgs e)
    {
        Application.Current.UnhandledException += UnhandledExceptionHandler;
        SentrySdk.Init("___PUBLIC_DSN___");
    }

    [HandleProcessCorruptedStateExceptions, SecurityCritical]
    void UnhandledExceptionHandler(object sender, UwpUnhandledExceptionEventArgs e)
    {
        //We need to backup the reference, because the Exception reference last for one access.
        //After that, a new  Exception reference is going to be set into e.Exception.
        var exception = e.Exception;
        if (exception != null)
        {
            exception.Data[Mechanism.HandledKey] = false;
            exception.Data[Mechanism.MechanismKey] = "Application.UnhandledException";
            SentrySdk.CaptureException(exception);
            SentrySdk.FlushAsync(TimeSpan.FromSeconds(10)).Wait();
            }
    }
}
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete UWP docs](https://docs.sentry.io/platforms/dotnet/guides/uwp/).

### Samples

You can find an example UWP app with Sentry integrated [on this GitHub repository.](https://github.com/sentry-demos/uwp-csharp)

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)

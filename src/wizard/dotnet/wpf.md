---
name: WPF
doc_link: https://docs.sentry.io/platforms/dotnet/guides/wpf/
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

## Install the NuGet package

```shell
# Using Package Manager
Install-Package Sentry -Version {{@inject packages.version('sentry.dotnet') }}

# Or using .NET Core CLI
dotnet add package Sentry -v {{@inject packages.version('sentry.dotnet') }}
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href=https://docs.sentry.io/platforms/dotnet/legacy-sdk/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

## Initialize the SDK

Initialize the SDK as early as possible, like in the constructor of the `App`:

```csharp
using System.Windows.Threading;
using System.Windows;
using Sentry;

public partial class App : Application
{
    public App()
    {
        DispatcherUnhandledException += App_DispatcherUnhandledException;
        SentrySdk.Init(o =>
        {
            // Tells which project in Sentry to send events to:
            o.Dsn = "___PUBLIC_DSN___";
            // When configuring for the first time, to see what the SDK is doing:
            o.Debug = true;
            // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            o.TracesSampleRate = 1.0;
        });
    }

    void App_DispatcherUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
    {
        SentrySdk.CaptureException(e.Exception);

        // If you want to avoid the application from crashing:
        e.Handled = true;
    }
}
```

## Verify

To verify your set up, you can capture a message with the SDK:

```csharp
SentrySdk.CaptureMessage("Hello Sentry");
```

### Performance Monitoring

You can measure the performance of your code by capturing transactions and spans.

```csharp
// Transaction can be started by providing, at minimum, the name and the operation
var transaction = SentrySdk.StartTransaction(
  "test-transaction-name",
  "test-transaction-operation"
);

// Transactions can have child spans (and those spans can have child spans as well)
var span = transaction.StartChild("test-child-operation");

// ...
// (Perform the operation represented by the span/transaction)
// ...

span.Finish(); // Mark the span as finished
transaction.Finish(); // Mark the transaction as finished and send it to Sentry
```

Check out [the documentation](https://docs.sentry.io/platforms/dotnet/performance/instrumentation/) to learn more about the API and automatic instrumentations.

If you don't want to depend on the static class, the SDK registers a client in the DI container. In this case, you can [take `IHub` as a dependency](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/unit-testing/).

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete WPF docs](https://docs.sentry.io/platforms/dotnet/guides/wpf/).

### Samples

You can find an example WPF app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/examples/tree/master/dotnet/WpfDotNetCoreCSharp)

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)

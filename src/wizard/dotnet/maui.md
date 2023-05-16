---
name: Multi-platform App UI (.NET MAUI)
doc_link: https://docs.sentry.io/platforms/dotnet/guides/maui/
support_level: production
type: framework
---

Install the **NuGet** package:

```shell {tabTitle:.NET Core CLI}
dotnet add package Sentry.Maui -v {{@inject packages.version('sentry.dotnet.maui') }}
```

```powershell {tabTitle:Package Manager}
Install-Package Sentry.Maui -Version {{@inject packages.version('sentry.dotnet.maui') }}
```

Then add Sentry to `MauiProgram.cs` through the `MauiAppBuilder`:

```csharp
public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();
    builder
        .UseMauiApp<App>()

        // Add this section anywhere on the builder:
        .UseSentry(options =>
        {
            // The DSN is the only required setting.
            options.Dsn = "___PUBLIC_DSN___";

            // Use debug mode if you want to see what the SDK is doing.
            // Debug messages are written to stdout with Console.Writeline,
            // and are viewable in your IDE's debug console or with 'adb logcat', etc.
            // This option is not recommended when deploying your application.
            options.Debug = true;

            // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.TracesSampleRate = 1.0;

            // Other Sentry options can be set here.
        })

        // ... the remainder of your MAUI app setup

    return builder.Build();
}
```

## Verify

To verify your set up, you can capture a message with the SDK, anywhere in your code after the application is built, such as in a page constructor or button click event handler:

```csharp
SentrySdk.CaptureMessage("Hello Sentry");
```

### Performance monitoring

We do not yet have automatic performance instrumentation for .NET MAUI. We will be adding that in a future release.
However, if desired you can still manually instrument parts of your application.

For some parts of your code, [automatic instrumentation](https://docs.sentry.io/platforms/dotnet/guides/maui/performance/instrumentation/automatic-instrumentation/) is available across all of our .NET SDKs, and can be used with MAUI as well:

- If your app uses `HttpClient`, you can instrument your HTTP calls by passing our HTTP message handler:
  ```csharp
  var httpHandler = new SentryHttpMessageHandler();
  var httpClient = new HttpClient(httpHandler);
  ```
- If your app uses Entity Framework Core or SQL Client, we will automatically instrument that for you without any additional code.

For other parts of your code, you can use [custom instrumentation](https://docs.sentry.io/platforms/dotnet/guides/maui/performance/instrumentation/custom-instrumentation/), such as in the following example:

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

## Sample Application

See the [MAUI Sample in the `sentry-dotnet` repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples/Sentry.Samples.Maui).

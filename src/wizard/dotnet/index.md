---
name: C#
doc_link: https://docs.sentry.io/platforms/dotnet/
support_level: production
type: language
---

<Alert level="info">
Sentry for .NET is a collection of NuGet packages provided by Sentry; it supports .NET Framework 4.6.1 and .NET Core 2.0 and above. At its core, Sentry for .NET provides a raw client for sending events to Sentry. If you use a framework such as <strong>ASP.NET</strong>, <strong>WinForms</strong>, <strong>WPF</strong>, <strong>MAUI</strong>, <strong>Xamarin</strong>, <strong>Serilog</strong>, or similar, we recommend visiting our <a href="https://docs.sentry.io/platforms/dotnet/">Sentry .NET</a> documentation for installation instructions.
</Alert>

Install the **NuGet** package:

```shell
# Using Package Manager
Install-Package Sentry -Version {{ packages.version('sentry.dotnet') }}

# Or using .NET Core CLI
dotnet add package Sentry -v {{ packages.version('sentry.dotnet') }}
```

Initialize the SDK as early as possible. For example, call `SentrySdk.Init` in your `Program.cs` file:

```csharp
using Sentry;

SentrySdk.Init(options =>
{
    // A Sentry Data Source Name (DSN) is required.
    // See https://docs.sentry.io/product/sentry-basics/dsn-explainer/
    // You can set it in the SENTRY_DSN environment variable, or you can set it in code here.
    options.Dsn = "___PUBLIC_DSN___";

    // When debug is enabled, the Sentry client will emit detailed debugging information to the console.
    // This might be helpful, or might interfere with the normal operation of your application.
    // We enable it here for demonstration purposes when first trying Sentry.
    // You shouldn't do this in your applications unless you're troubleshooting issues with Sentry.
    options.Debug = true;

    // This option is recommended, which enables Sentry's "Release Health" feature.
    options.AutoSessionTracking = true;

    // This option is recommended for client applications only. It ensures all threads use the same global scope.
    // If you're writing a background service of any kind, you should remove this.
    options.IsGlobalModeEnabled = true;

    // This option will enable Sentry's tracing features. You still need to start transactions and spans.
    options.EnableTracing = true;
});
```

Verify Sentry is correctly configured by sending a message:

```csharp
SentrySdk.CaptureMessage("Something went wrong");
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

### Samples

You can find an example ASP.NET MVC 5 app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/examples/tree/master/dotnet/AspNetMvc5Ef6)

In addition, these examples demonstrate how to integrate Sentry with various frameworks:

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)

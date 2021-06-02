---
name: C#
doc_link: https://docs.sentry.io/platforms/dotnet/
support_level: production
type: language
---

<Alert level="info">
Sentry for .NET is a collection of NuGet packages provided by Sentry; it supports .NET Framework 4.6.1 and .NET Core 2.0 and above. At its core, Sentry for .NET provides a raw client for sending events to Sentry. If you use a framework such as <strong>ASP.NET</strong>, <strong>WinForms</strong>, <strong>WPF</strong>, <strong>Xamarin</strong>, <strong>Serilog</strong>, or similar, we recommend visiting our <a href="https://docs.sentry.io/platforms/dotnet/">Sentry .NET</a> documentation for installation instructions.
</Alert>

Install the **NuGet** package:

```shell
# Using Package Manager
Install-Package Sentry -Version {{ packages.version('sentry.dotnet') }}

# Or using .NET Core CLI
dotnet add package Sentry -v {{ packages.version('sentry.dotnet') }}
```

Initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

```csharp
using (SentrySdk.Init(o =>
    {
        o.Dsn = "___PUBLIC_DSN___";
        // When configuring for the first time, to see what the SDK is doing:
        o.Debug = true;
        // Set traces_sample_rate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        o.TracesSampleRate = 1.0;
    }))
{
    // App code goes here. Dispose the SDK before exiting to flush events.
}
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

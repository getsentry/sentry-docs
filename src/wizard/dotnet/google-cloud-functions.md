---
name: Google Cloud Functions
doc_link: https://docs.sentry.io/platforms/dotnet/guides/google-cloud-functions/
support_level: production
type: framework
---

Install the **NuGet** package:

Package Manager:

```shell
Install-Package Sentry.Google.Cloud.Functions -Version {{ packages.version('sentry.google.cloud.functions') }}
```

Or .NET Core CLI:

```shell
dotnet add package Sentry.Google.Cloud.Functions -v {{ packages.version('sentry.google.cloud.functions') }}
```

Add Sentry to `Function` class through the `FunctionsStartup`:


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

Additionally, you'll need to setup your `Sentry` settings on `appsettings.json`

```json
{
  "Sentry": {
    "Dsn": "___PUBLIC_DSN___",
    // Sends Cookies, User Id when one is logged on and user IP address to sentry. It's turned off by default.
    "SendDefaultPii": true,
    // Enable tracing.
    "TracesSampleRate": 1.0,
    // Opt-in for payload submission.
    "MaxRequestBodySize": "Always"
  }
}

```

## Verify

To verify your set up, you can capture a message with the SDK:

```csharp
public Task HandleAsync(HttpContext context)
{
    SentrySdk.CaptureMessage("Hello Sentry");
}
```

### Performance monitoring

You can measure the performance of your code by capturing transactions and spans.

```csharp
public Task HandleAsync(HttpContext context)
{
    // Transaction can be started by providing, at minimum, the name and the operation
    var transaction = SentrySdk.StartTransaction(
    "test-transaction-name",
    "test-transaction-operation"
    );
    SentrySdk.ConfigureScope(scope => scope.Transaction = transaction);

    // Transactions can have child spans (and those spans can have child spans as well)
    var span = transaction.StartChild("test-child-operation");

    // ...
    // (Perform the operation represented by the span/transaction)
    // ...

    span.Finish(); // Mark the span as finished
    transaction.Finish(); // Mark the transaction as finished and send it to Sentry
}
```

Check out [the documentation](https://docs.sentry.io/platforms/dotnet/performance/instrumentation/) to learn more about the API.

## Samples

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Google Cloud Functions sample](https://github.com/getsentry/sentry-dotnet/tree/main/samples/Sentry.Samples.Google.Cloud.Functions)
- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)
- [Giraffe F# sample](https://github.com/sentry-demos/giraffe) (**F#**)

---
name: ASP.NET Core
doc_link: https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/
support_level: production
type: framework
---

Install the **NuGet** package:

Package Manager:

```shell
Install-Package Sentry.AspNetCore -Version {{ packages.version('sentry.dotnet.aspnetcore') }}
```

Or .NET Core CLI:

```shell
dotnet add package Sentry.AspNetCore -v {{ packages.version('sentry.dotnet.aspnetcore') }}
```

Add Sentry to `Program.cs` through the `WebHostBuilder`:


```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            // Add the following line:
            webBuilder.UseSentry(o =>
            {
                o.Dsn = "___PUBLIC_DSN___";
                // When configuring for the first time, to see what the SDK is doing:
                o.Debug = true;
                // Set traces_sample_rate to 1.0 to capture 100% of transactions for performance monitoring.
                // We recommend adjusting this value in production.
                o.TracesSampleRate = 1.0;
            });
        });
```

## Verify

To verify your set up, you can capture a message with the SDK:

```csharp
SentrySdk.CaptureMessage("Hello Sentry");
```

If you don't want to depend on the static class, the SDK registers a client in the DI container. In this case, you can [take `IHub` as a dependency](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/unit-testing/).

### Performance monitoring

You can measure the performance of your endpoints by adding a middleware to `Startup.cs`:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Sentry.AspNetCore;

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();

        // Enable automatic tracing integration.
        // Make sure to put this middleware right after `UseRouting()`.
        app.UseSentryTracing();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        });
    }
}
```

You'll be able to monitor the performance of your actions automatically. To add additional spans to it, you can use the API:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sentry;

public class HomeController : Controller
{
    private readonly IHub _sentryHub;

    public HomeController(IHub sentryHub) => _sentryHub = sentryHub;

    [HttpGet("/person/{id}")]
    public IActionResult Person(string id)
    {
        var childSpan = _sentryHub.GetSpan()?.StartChild("additional-work");
        try
        {
            // Do the work that gets measured.

            childSpan?.Finish(SpanStatus.Ok);
        }
        catch (Exception e)
        {
            childSpan?.Finish(e);
            throw;
        }
    }
}
```

## Samples

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)
- [Giraffe F# sample](https://github.com/sentry-demos/giraffe) (**F#**)

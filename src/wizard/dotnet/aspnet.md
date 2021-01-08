---
name: ASP.NET
doc_link: https://docs.sentry.io/platforms/dotnet/guides/aspnet/
support_level: production
type: framework
---

Install the **NuGet** package:

Package Manager:

```shell
Install-Package Sentry -Version {{ packages.version('sentry.dotnet') }}
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

You should `init` the Sentry SDK as soon as possible during your application load by adding Sentry to `Global.asax.cs`:

```csharp
using System.Web;
using Sentry;

public class MvcApplication : HttpApplication
{
    private IDisposable _sentry;

    protected void Application_Start()
    {
        // Initialize Sentry to capture AppDomain unhandled exceptions and more.
        _sentry = SentrySdk.Init("___PUBLIC_DSN___");
    }

    protected void Application_Error()
    {
        var exception = Server.GetLastError();
        // Capture the server errors.
        SentrySdk.CaptureException(exception);
    }

    protected void Application_End()
    {
        // Flushes out events before shutting down.
        _sentry?.Dispose();
    }
}
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete ASP.NET docs](https://docs.sentry.io/platforms/dotnet/guides/aspnet/).

### Samples

You can find an example ASP.NET MVC 5 app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/examples/tree/master/dotnet/AspNetMvc5Ef6)

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)

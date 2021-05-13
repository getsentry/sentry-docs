---
name: ASP.NET
doc_link: https://docs.sentry.io/platforms/dotnet/guides/aspnet/
support_level: production
type: framework
---

Install the **NuGet** package:

Package Manager:

```shell
Install-Package Sentry.AspNet -Version {{ packages.version('sentry.dotnet.aspnet') }}
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

You should `init` the Sentry SDK as soon as possible during your application load by adding Sentry to `Global.asax.cs`:

```csharp
using System;
using System.Configuration;
using System.Web.Mvc;
using System.Web.Routing;
using Sentry;
using Sentry.AspNet;

public class MvcApplication : HttpApplication
{
    private IDisposable _sentry;

    protected void Application_Start()
    {
        // Initialize Sentry to capture AppDomain unhandled exceptions and more.
        _sentry = SentrySdk.Init(o =>
        {
            o.AddAspNet();
            o.Dsn = "___PUBLIC_DSN___";
        });
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
    
    protected void Application_BeginRequest()
    {
        // Start a transaction that encompasses the current request
        var transaction = Context.StartSentryTransaction();

        // Attach transaction to the request context to finish it when the request ends
        Context.Items["__SentryTransaction"] = transaction;
    }

    protected void Application_EndRequest()
    {
        // Finish the currently active transaction
        if (Context.Items.Contains("__SentryTransaction"))
        {
            var transaction = Context.Items["__SentryTransaction"] as ISpan;

            var status =
                Context.Response.StatusCode < 400 ? SpanStatus.Ok :
                Context.Response.StatusCode == 400 ? SpanStatus.InvalidArgument :
                Context.Response.StatusCode == 401 ? SpanStatus.Unauthenticated :
                Context.Response.StatusCode == 403 ? SpanStatus.PermissionDenied :
                Context.Response.StatusCode == 404 ? SpanStatus.NotFound :
                Context.Response.StatusCode == 409 ? SpanStatus.AlreadyExists :
                Context.Response.StatusCode == 429 ? SpanStatus.ResourceExhausted :
                Context.Response.StatusCode == 499 ? SpanStatus.Cancelled :
                Context.Response.StatusCode < 500 ? SpanStatus.InvalidArgument :
                Context.Response.StatusCode == 500 ? SpanStatus.InternalError :
                Context.Response.StatusCode == 501 ? SpanStatus.Unimplemented :
                Context.Response.StatusCode == 503 ? SpanStatus.Unavailable :
                Context.Response.StatusCode == 504 ? SpanStatus.DeadlineExceeded :
                Context.Response.StatusCode < 600 ? SpanStatus.InternalError :
                SpanStatus.UnknownError;

            transaction?.Finish(status);
        }
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

---
title: Entity Framework
sidebar_order: 8
---

Sentry has an integration with `EntityFramework` through the of the [Sentry.EntityFramework NuGet package](https://www.nuget.org/packages/Sentry.EntityFramework).

> Looking for `EntityFramework Core`? That integration is achieved through the [Sentry.Extensions.Logging](/platforms/dotnet/microsoft-extensions-logging/) package.


## Installation

Using package manager:

```powershell
Install-Package Sentry.EntityFramework -Version {% sdk_version sentry.dotnet.ef %}
```

Or using the .NET Core CLI:

```sh
dotnet add package Sentry.EntityFramework -v {% sdk_version sentry.dotnet.ef %}
```

This package extends `Sentry` main SDK. That means that besides the EF features, through this package you'll also get access to all API and features available in the main `Sentry` SDK.

## Features

* Queries as breadcrumbs
* Validation errors

All queries executed are added as breadcrumbs and are sent with any event which happens on the same [scope](/enriching-error-data/scopes/). Besides that, validation errors are also included as `Extra`.


## Configuration

There are 2 steps to adding Entity Framework 6 support to your project:

* Call `SentryDatabaseLogging.UseBreadcrumbs()` to either your application's startup method, or into a static constructor inside your Entity Framework object. Make sure you only call this method once! This will add the interceptor to Entity Framework to log database queries.
* When initializing the SDK, call the extension method `AddEntityFramework()` on `SentryOptions`. This will register all error processors to extract extra data, such as validation errors, from the exceptions thrown by Entity Framework.

### Example configuration

For example, configuring an ASP.NET app with _global.asax_:

```csharp
public class MvcApplication : System.Web.HttpApplication
{
    private IDisposable _sentrySdk;

    protected void Application_Start()
    {
        // We add the query logging here so multiple DbContexts in the same project are supported
        SentryDatabaseLogging.UseBreadcrumbs();
        _sentrySdk = SentrySdk.Init(o =>
        {
            // We store the DSN inside Web.config
            o.Dsn = new Dsn(ConfigurationManager.AppSettings["SentryDsn"]);
            // Add the EntityFramework integration
            o.AddEntityFramework();
        });
    }

    // Global error catcher
    protected void Application_Error()
    {
        var exception = Server.GetLastError();
        SentrySdk.CaptureException(exception);
    }

    public override void Dispose()
    {
        _sentrySdk.Dispose();
        base.Dispose();
    }
}
```

### Sample

Check out a complete working [sample](https://github.com/getsentry/sentry-dotnet-ef/tree/master/samples/Sentry.Samples.AspNet.Mvc) to see it in action.

![Sample breadcrumbs in Sentry]({% asset dotnet-entityframework.png @path %})

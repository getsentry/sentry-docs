---
name: ASP.NET Core
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=aspnetcore
support_level: production
type: framework
---
Install the **NuGet** package:

Package Manager:
```shell
Install-Package Sentry.AspNetCore -Version 2.1.5
```

.NET Core CLI:
```shell
dotnet add package Sentry.AspNetCore -v 2.1.5
```




Add Sentry to `Program.cs` through the `WebHostBuilder`:

ASP.NET Core 2.x:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry("___PUBLIC_DSN___");
```

ASP.NET Core 3.0:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            // Add the following line:
            webBuilder.UseSentry("___PUBLIC_DSN___");
        });
```



See the [provided examples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) for examples to send your first event to Sentry.

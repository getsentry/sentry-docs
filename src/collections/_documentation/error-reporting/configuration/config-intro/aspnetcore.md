Options can be set by passing a callback to the `UseSentry()` method which will
pass the option object along for modifications:

ASP.NET Core 2.x:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry(o =>
        {
            o.Dsn = "___PUBLIC_DSN___";
            o.MaxBreadcrumbs = 50;
            o.Debug = true;
        });
```

ASP.NET Core 3.0:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            // Add the following line:
            webBuilder.UseSentry(o =>
            {
                o.Dsn = "___PUBLIC_DSN___";
                o.MaxBreadcrumbs = 50;
                o.Debug = true;
            });
        });
```

Add Sentry to `Program.cs` through the `WebHostBuilder`:

ASP.NET Core 2.x:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry("___PUBLIC_DSN___")
```

ASP.NET Core 3.0:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            // Add the following line:
            webBuilder.UseSentry("___PUBLIC_DSN___")
        });
```

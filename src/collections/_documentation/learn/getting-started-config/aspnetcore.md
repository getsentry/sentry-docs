Add Sentry to `Program.cs` through the `WebHostBuilder`:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()
        // Add this:
        .UseSentry("___PUBLIC_DSN___")
        .Build();
```

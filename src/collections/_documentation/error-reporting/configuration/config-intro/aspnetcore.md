Options can be set by passing a callback to the `UseSentry()` method which will
pass the option object along for modifications:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseSentry(o =>
        {
            o.Dsn = "___PUBLIC_DSN___";
            o.MaxBreadcrumbs = 50;
            o.Debug = true;
        })
```

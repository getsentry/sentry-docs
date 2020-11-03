---
name: ASP.NET Core
doc_link: https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/
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

```Paket
paket add Sentry.AspNetCore --version 2.1.5
```

Add Sentry to `Program.cs` through the `WebHostBuilder`:

ASP.NET Core 2.x:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry("___PUBLIC_DSN___");
```

```fsharp
let BuildWebHost args =
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
            webBuilder.UseSentry("___PUBLIC_DSN___");
        });
```

```fsharp
let CreateHostBuilder args =
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(fun webBuilder ->
            // Add the following line:
            webBuilder.UseSentry("___PUBLIC_DSN___") |> ignore
        )
```

## Samples

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)
- [Giraffe F# sample](https://github.com/sentry-demos/giraffe) (**F#**)

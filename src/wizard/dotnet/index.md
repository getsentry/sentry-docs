---
name: C#
doc_link: https://docs.sentry.io/platforms/dotnet/
support_level: production
type: language
---

Install the **NuGet** package:

```shell
# Using Package Manager
Install-Package Sentry -Version {{ packages.version('sentry.dotnet') }}

# Or using .NET Core CLI
dotnet add package Sentry -v {{ packages.version('sentry.dotnet') }}
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

Initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

**C#**
```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    // App code
}
```

**F#**
```fsharp
use __ = SentrySdk.Init ("___PUBLIC_DSN___")
// App code
```

Verify Sentry is capturing unhandled exceptions by raising an exception. For example, you can use the following snippet to raise a `NullReferenceException`:

**C#**
```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    throw null;
}
```

**F#**
```fsharp
use __ = SentrySdk.Init ("___PUBLIC_DSN___")
raise <| NullReferenceException ()
```

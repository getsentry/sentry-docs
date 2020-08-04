---
name: C#
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=csharp
support_level: production
type: language
---
Install the **NuGet** package:

```shell
# Using Package Manager
Install-Package Sentry -Version 2.1.5

# Or using .NET Core CLI
dotnet add package Sentry -v 2.1.5
```


<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5. 
    </div>
</div>





You should initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    // App code
}
```



You can verify Sentry is capturing unhandled exceptions by raising an exception. For example, you can use the following snippet to raise a `DivideByZeroException`:

```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    Console.WriteLine(1 / 0);
}
```

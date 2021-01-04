---
name: WinForms
doc_link: https://docs.sentry.io/platforms/dotnet/guides/winforms/
support_level: production
type: language
---

## Install the NuGet package

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

## Initialize the SDK

Initialize the SDK as early as possible, like in the constructor of the `App`:

```csharp
using System;
using System.Windows.Forms;
using Sentry;

static class Program
{
    [STAThread]
    static void Main()
    {
        // Init the Sentry SDK
        SentrySdk.Init("___PUBLIC_DSN___");
        // Configure WinForms to throw exceptions so Sentry can capture them.
        Application.SetUnhandledExceptionMode(UnhandledExceptionMode.ThrowException);

        // Any other configuration you might have goes here...
        
        Application.Run(new Form1());
    }
}
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete WinForms docs](https://docs.sentry.io/platforms/dotnet/guides/winforms/).

### Samples

You can find an example WinForms app with Sentry integrated [on this GitHub repository.](https://github.com/getsentry/examples/tree/master/dotnet/WindowsFormsCSharp)

See the following examples that demonstrate how to integrate Sentry with various frameworks:

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)

---
title: Windows Forms
sidebar_order: 30
---

Besides the [main configuration like calling `SentrySdk.Init`](/platforms/dotnet/), you must consider the WinForms specific configuration.

Sentry's .NET SDK works with WinForms applications through the [Sentry NuGet package](https://www.nuget.org/packages/Sentry). It works with WinForms apps running on .NET Framework 4.6.1, .NET Core 3.0, or higher.

## Configuration

The SDK automatically captures unhandled exceptions that hit the `AppDomain.UnhandledException`, but on Windows Forms, for production apps (when no debugger is attached), the small Window pops up when a crash happens. In order to get the exception to rethrow and be captured by Sentry, you must also configure:

```csharp
using System.Windows.Forms;

Application.SetUnhandledExceptionMode(UnhandledExceptionMode.ThrowException);
```

### Resources

[Discussion on GitHub `Application.SetUnhandledExceptionMode`](https://github.com/getsentry/sentry-dotnet/issues/176)

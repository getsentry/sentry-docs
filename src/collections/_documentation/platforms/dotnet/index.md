---
title: .NET
---

{% include learn-sdk.md platform="csharp" %}

This section will describe features, configurations and general functionality which are specific to the .NET SDK.

## Integrations

- [_ASP.NET Core_](/platforms/dotnet/aspnetcore/)
- [_EntityFramework_](/platforms/dotnet/entityframework/)
- [_log4net_](/platforms/dotnet/log4net/)
- [_Microsoft.Extensions.Logging_](/platforms/dotnet/microsoft-extensions-logging/)
- [_Serilog_](/platforms/dotnet/serilog/)
- [_NLog_](/platforms/dotnet/nlog/)

## Compatibility

The main [Sentry NuGet package](https://www.nuget.org/packages/Sentry) targets .NET Standard 2.0. That means, according to the [compatibility table](https://docs.microsoft.com/en-us/dotnet/standard/net-standard), it is compatible with the following versions or newer:

* .NET Framework 4.6.1 (4.7.2 advised)
* .NET Core 2.0
* Mono 5.4
* Xamarin.Android 8.0
* Xamarin.Mac 3.8
* Xamarin.iOS 10.14
* Universal Windows Platform 10.0.16299

Of those, we run our unit/integration tests against:

* .NET Framework 4.7.2 on Windows
* Mono 5.12 macOS and Linux
* .NET Core 2.0 Windows, macOS and Linux
* .NET Core 2.1 Windows, macOS and Linux

{% include components/alert.html
  title="Using an older version of .NET Framework or Mono?"
  content="[Our legacy SDK](https://docs.sentry.io/clients/csharp/) supports .NET Framework as early as 3.5."
  level="info"
%}

{% include components/alert.html
  title="Upgrading the SDK and want to understand what's new?"
  content="Have a look at the [Changelog](https://github.com/getsentry/sentry-dotnet/releases)."
  level="info"
%}

## Ignoring Exceptions

You can ignore exceptions by their type when initializing the SDK:

```csharp
SentrySdk.Init(o => o.AddExceptionFilterForType<OperationCancelledException>());
```

It works in the whole inheritance chain.  
The example above will also filter out `TaskCancelledException` because it derives from `OperationCancelledException`.


## Automatically discovering release version

The SDK attempts to locate the release to add that to the events sent to Sentry.

> [Default values like 1.0 or 1.0.0.0 are ignored](https://github.com/getsentry/sentry-dotnet/blob/dbb5a3af054d0ca6f801de37fb7db3632ca2c65a/src/Sentry/Internal/ApplicationVersionLocator.cs#L14-L21).

The SDK will firstly look at the [entry assembly's](https://msdn.microsoft.com/en-us/library/system.reflection.assembly.getentryassembly(v=vs.110).aspx) `AssemblyInformationalVersionAttribute`, which accepts a string as
value and is often used to set a GIT commit hash. 

If that returns null, it'll look at the default `AssemblyVersionAttribute` which accepts the numeric version number. When creating a project with Visual Studio, the value is set to *1.0.0.0*.
Since that usually means that the version is either not being set, or is set via a different method. The **automatic version detection will disregard** this value and no *Release* will be reported automatically.

## Unit testing

We often don't want to couple our code with a static class like `SentrySdk`. Especially to allow our code to be testable.
If that's your case, you can use 2 abstractions:

* `ISentryClient`
* `IHub`

The `ISentryClient` exposes the `CaptureEvent` method and its implementation `SentryClient` is responsible for queueing the event to be sent to Sentry. It also abstracts away the internal transport.

The `IHub` on the other hand, holds a client and the current [scope](/enriching-error-data/scopes/). In fact, it extends `ISentryClient` and is able to dispatch calls to the right client depending on the current scope.

In order to allow different events to hold different contextual data, you need to know in which scope you are in.
That's the job of the [`Hub`](https://github.com/getsentry/sentry-dotnet/blob/master/src/Sentry/Internal/Hub.cs). It holds the scope management as well as a client.

If all you are doing is sending events, without modification/access to the current scope, then you depend on `ISentryClient`. If on the other hand you would like to have access to the current scope by configuring it or binding a different client to it, you depend on `IHub`.

An example using `IHub` for testability is [SentryLogger](https://github.com/getsentry/sentry-dotnet/blob/master/src/Sentry.Extensions.Logging/SentryLogger.cs) and its unit tests [SentryLoggerTests](https://github.com/getsentry/sentry-dotnet/blob/master/test/Sentry.Extensions.Logging.Tests/SentryLoggerTests.cs).  
`SentryLogger` depends on `IHub` because it does modify the scope (through `AddBreadcrumb`). In case it only sent events, it should instead depend on `ISentryClient`

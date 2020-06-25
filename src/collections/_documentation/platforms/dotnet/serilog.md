---
title: Serilog
sidebar_order: 14
---

Sentry has an integration with `Serilog` through the [Sentry.Serilog NuGet package](https://www.nuget.org/packages/Sentry.Serilog).

## Installation

Using package manager:

```powershell
Install-Package Sentry.Serilog -Version {% sdk_version sentry.dotnet.serilog %}
```

Or using the .NET Core CLI:

```sh
dotnet add package Sentry.Serilog -v {% sdk_version sentry.dotnet.serilog %}
```

This package extends `Sentry` main SDK. That means that besides the logging related features, through this package you'll also get access to all API and features available in the main `Sentry` SDK.

{% capture __alert_content -%}
Messages logged from assemblies with the name starting with `Sentry` will not generate events.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

## Features

* Store log messages as breadcrumbs
* Send events to sentry

Two separate settings define the minimum log level to keep the log entry as a `Breadcrumb` and to send an `Event` to Sentry. The events include any stored breadcrumb on that [scope](/enriching-error-data/scopes/).

By default, any message with log level `Information` or higher will be kept as a `Breadcrumb`.

The default value to report a log entry as an event to Sentry is `Error`.

This means that out of the box, any `LogError` call will create an `Event` which will include all log messages of level `Information`, `Warning` and also `Error` and `Critical`.


## Configuration

You can configure the Sentry Serilog sink as follows:

```csharp
Log.Logger = new LoggerConfiguration()
  .WriteTo.Sentry(o =>
  {
    // Debug and higher are stored as breadcrumbs (default is Information)
    o.MinimumBreadcrumbLevel = LogEventLevel.Debug;
    // Warning and higher is sent as event (default is Error)
    o.MinimumEventLevel = LogEventLevel.Warning;
  })
  .CreateLogger();
```

It's also possible to initialize the SDK through the Serilog integration. This is useful when the Serilog is the only integration being used in your application. To initialize the Sentry SDK through the Serilog integration, provide it with the DSN:

```csharp
Log.Logger = new LoggerConfiguration()
  .WriteTo.Sentry(o => o.Dsn = new Dsn("___PUBLIC_DSN___"))
  .CreateLogger();
```

{% capture __alert_content -%}
The SDK only needs to be initialized once. If a `DSN` is made available to this integration, by default it **will** initialize the SDK. If you do not wish to initialize the SDK via this integration, set the `InitializeSdk` flag to **false**. Not providing a DSN or leaving it as `null` instructs the integration not to initialize the SDK and unless another integration initializes it or you call `SentrySdk.Init`, the SDK will stay disabled.{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

### Options

#### MinimumBreadcrumbLevel

A `LogLevel` which indicates the minimum level a log message has to be included as a breadcrumb. By default this value is `Information`.

#### MinimumEventLevel

A `LogLevel` which indicates the minimum level a log message has to be sent to Sentry as an event. By default this value is `Error`.

#### InitializeSdk

Whether or not this integration should initialize the SDK. If you intend to call `SentrySdk.Init` yourself you should set this flag to `false`.

### Samples

* A [simple example](https://github.com/getsentry/sentry-dotnet/tree/main/samples/Sentry.Samples.Serilog).
* An [example with ASP.NET Core](https://github.com/getsentry/sentry-dotnet/tree/main/samples/Sentry.Samples.AspNetCore.Serilog).

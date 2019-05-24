---
title: NLog
sidebar_order: 13
---

Sentry has an integration with `NLog` through the [Sentry.NLog NuGet package](https://www.nuget.org/packages/Sentry.NLog).

## Installation

Using package manager:

```powershell
Install-Package Sentry.NLog -Version {% sdk_version sentry.dotnet.nlog %}
```

Or using the .NET Core CLI:

```sh
dotnet add package Sentry.NLog -v {% sdk_version sentry.dotnet.nlog %}
```

This package extends `Sentry` main SDK. That means that besides the logging related features, through this package you'll also get access to all API and features available in the main `Sentry` SDK.

> NOTE: Messages logged from assemblies with the name starting with `Sentry` will not generate events.

## Features

* Store log messages as breadcrumbs
* Send events to sentry

Two separate settings define the minimum log level to keep the log entry as a `Breadcrumb` and to send an `Event` to Sentry. The events include any stored breadcrumb on that [scope]({% link _documentation/enriching-error-data/scopes.md %}).

By default, Sentry will keep any message with log level `Info` or higher as a `Breadcrumb`.

The default value to report a log entry as an event to Sentry is `Error`.

This means that out of the box, any `Error` call will create an `Event` which will include all log messages of level `Info`, `Warn` and also `Error` and `Critical`.


## Configuration

You can configure the Sentry NLog target via code as follows:

```csharp
LogManager.Configuration = new LoggingConfiguration();
LogManager.Configuration
    .AddSentry(o =>
    {
        // Optionally specify a separate format for message
        o.Layout = "${message}";
        // Optionally specify a separate format for breadcrumbs
        o.BreadcrumbLayout = "${logger}: ${message}";

        // Debug and higher are stored as breadcrumbs (default is Info)
        o.MinimumBreadcrumbLevel = LogLevel.Debug;
        // Error and higher is sent as event (default is Error)
        o.MinimumEventLevel = LogLevel.Error;

        // Send the logger name as a tag
        o.AddTag("logger", "${logger}");

        // All Sentry Options are accessible here.
    });  
```

It's also possible to initialize the SDK through the NLog integration (as opposed to using `SentrySdk.Init`). 
This is useful when NLog is the only integration being used in your application. To initialize the Sentry SDK through the NLog integration, provide it with the DSN:

```csharp
LogManager.Configuration = new LoggingConfiguration();
LogManager.Configuration
    .AddSentry(o =>
    {
        // The NLog integration will initialize the SDK if DSN is set:
        o.Dsn = new Dsn("___PUBLIC_DSN___"));
    });  
```

> **Note on SDK initialization**:
The SDK only needs to be initialized once. If a `DSN` is made available to this integration, by default it **will** initialize the SDK. If you do not wish to initialize the SDK via this integration, set the `InitializeSdk` flag to **false**. Not providing a DSN or leaving it as `null` instructs the integration not to initialize the SDK and unless another integration initializes it or you call `SentrySdk.Init`, the SDK will stay disabled.

> **Note on minimum log level**: 
Two log levels are used to configure this integration (see options below). One will configure the lowest level required for a log message to become an event (`MinimumEventLevel`) sent to Sentry. The other option (`MinimumBreadcrumbLevel`) configures the lowest level a message has to be to become a breadcrumb. Breadcrumbs are kept in memory (by default the last 100 records) and are sent with events. For example, by default, if you log 100 entries with `logger.Info` or `logger.Warn`, no event is sent to Sentry. If you then log with `logger.Error`, an event is sent to Sentry which includes those 100 `Info` or `Warn` messages. For this to work, `SentryTarget` needs to receive **all** log entries in order to decide what to keep as breadcrumb or sent as event. Make sure to set the `NLog` `LogLevel` configuration to a value lower than what you set for the `MinimumBreadcrumbLevel` and `MinimumEventLevel` to make sure `SentryTarget` receives these log messages.


The SDK can also be configured via `NLog.config` XML file:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <extensions>
    <add assembly="Sentry.NLog" />
  </extensions>

  <targets>
    <target xsi:type="Sentry" name="sentry"
            dsn="___PUBLIC_DSN___"
            layout="${message}"
            debug="true"
            breadcrumbLayout="${message}"
            minimumBreadcrumbLevel="Debug"
            minimumEventLevel="Error">

      <!-- Advanced options can be configured here-->
      <options
          environment="Development"
          attachStacktrace="true"
          sendDefaultPii="true"
          shutdownTimeoutSeconds="5"
        >
        <!--Advanced options can be specified as attributes or elements-->
        <includeEventDataOnBreadcrumbs>true</includeEventDataOnBreadcrumbs>
      </options>

      <!--Add any desired additional tags that will be sent with every message -->
      <tag name="logger" layout="${logger}" />
      <tag name="example" layout="sentry-nlog" />
    </target>
  </targets>

  <rules>
    <logger name="*" writeTo="sentry" />
  </rules>
</nlog>
```

### Options

#### MinimumBreadcrumbLevel

A `LogLevel` that indicates the minimum level a log message needs to be in order to become a breadcrumb. By default, this value is `Info`.

#### MinimumEventLevel

A `LogLevel` which indicates the minimum level a log message has to be sent to Sentry as an event. By default this value is `Error`.

#### InitializeSdk

Whether or not this integration should initialize the SDK. If you intend to call `SentrySdk.Init` yourself you should set this flag to `false`.

#### IgnoreEventsWithNoException

To ignore log messages that don't contain an exception.

#### SendEventPropertiesAsData

Determines whether event-level properties will be sent to sentry as additional data. Defaults to true.

#### SendEventPropertiesAsTags

Determines whether event properties will be sent to sentry as Tags or not. Defaults to false.

#### IncludeEventDataOnBreadcrumbs

Determines whether or not to include event-level data as data in breadcrumbs for future errors. Defaults to false.

#### BreadcrumbLayout

Custom layout for breadcrumbs. See [NLog layout renderers](https://nlog-project.org/config/?tab=layout-renderers) for more.

#### Layout

Configured layout for the NLog logger.

#### Tags

Any additional tags to apply to each logged message.

### Samples

* A [simple example](https://github.com/getsentry/sentry-dotnet/tree/master/samples/Sentry.Samples.NLog).

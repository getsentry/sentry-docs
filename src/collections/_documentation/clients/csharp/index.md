---
title: 'C#'
robots: noindex
---

Raven is the C# client for Sentry. Raven relies on the most popular logging libraries to capture and convert logs before sending details to a Sentry instance.

<!-- WIZARD -->
## Installation

A [NuGet Package](https://www.nuget.org/packages/SharpRaven) is available for SharpRaven if you don’t want to compile it yourself.

Instantiate the client with your DSN:

```csharp
var ravenClient = new RavenClient("___PUBLIC_DSN___");
```

## Capturing Exceptions

Call out to the client in your catch block:

```csharp
try
{
    int i2 = 0;
    int i = 10 / i2;
}
catch (Exception exception)
{
    ravenClient.Capture(new SentryEvent(exception));
}
```
<!-- ENDWIZARD -->

## Logging Non-Exceptions

You can capture a message without being bound by an exception:

```csharp
ravenClient.Capture(new SentryEvent("Hello World!"));
```

## Additional Data

You can add additional data to the [Exception.Data](https://msdn.microsoft.com/en-us/library/system.exception.data.aspx) property on exceptions thrown about in your solution:

```csharp
try
{
    // ...
}
catch (Exception exception)
{
    exception.Data.Add("SomeKey", "SomeValue");
    throw;
}
```

The data `SomeKey` and `SomeValue` will be captured and presented in the `extra` property on Sentry.

Additionally, the `SentryEvent` class allow you to provide extra data to be sent with your request, such as `ErrorLevel`, `Fingerprint`, a custom `Message` and _Tags_.

## Async Support

In the .NET 4.5 build of SharpRaven, there are `async` versions of the above methods as well:

```csharp
async Task<string> CaptureAsync(SentryEvent @event);
```

## Nancy Support

You can install the [SharpRaven.Nancy](https://www.nuget.org/packages/SharpRaven.Nancy) package to capture the HTTP context in [Nancy](http://nancyfx.org/) applications. It will auto-register on the `IPipelines.OnError` event, so all unhandled exceptions will be sent to Sentry.

The only thing you have to do is provide a DSN, either by registering an instance of the `Dsn` class in your container:

```csharp
protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
{
    container.Register(new Dsn("___PUBLIC_DSN___"));
}
```

or through configuration:

```xml
<configuration>
  <configSections>
    <section name="sharpRaven" type="SharpRaven.Nancy.NancyConfiguration, SharpRaven.Nancy" />
  </configSections>
  <sharpRaven>
    <dsn value="___PUBLIC_DSN___" />
  </sharpRaven>
</configuration>
```

The DSN will be picked up by the auto-registered `IRavenClient` instance, so if you want to send events to Sentry, all you have to do is add a requirement on `IRavenClient` in your classes:

```csharp
public class LoggingModule : NancyModule
{
    private readonly IRavenClient ravenClient;

    public LoggingModule(IRavenClient ravenClient)
    {
        this.ravenClient = ravenClient;
    }
}
```

## Breadcrumbs

Sentry supports a concept called [Breadcrumbs]({%- link _documentation/enriching-error-data/breadcrumbs.md -%}), which is a trail of events which happened prior to an issue. Often times these events are very similar to traditional logs, but also have the ability to record more rich structured data.

```csharp
public class ExampleController : ApiController
{
    private readonly IRavenClient ravenClient;

    public ExampleController(IRavenClient ravenClient)
    {
        this.ravenClient = ravenClient;
    }

    public IHttpActionResult GetProduct(int id) {
        ravenClient.AddTrail(new Breadcrumb("example") { Message = "some message...", Level = BreadcrumbLevel.Info } );

        var product = products.FirstOrDefault((p) => p.Id == id);
        if (product == null)
        {
            ravenClient.AddTrail(new Breadcrumb("example") { Message = "Ops! It was not found.", Level = BreadcrumbLevel.Warn } );
            return NotFound();
        }

        return Ok(product);
    }
}
```

## Debugging SharpRaven

If an exception is raised internally to `RavenClient` it is logged to the `Console`. To extend this behaviour use the property `ErrorOnCapture`:

```csharp
ravenClient.ErrorOnCapture = exception =>
{
    // Custom code here
};
```

You can also hook into the `BeforeSend` function to inspect or manipulate the data being sent to Sentry before it is sent:

```csharp
ravenClient.BeforeSend = requester =>
{
    // Here you can log data from the requester
    // or replace it entirely if you want.
    return requester;
}
```

## Resources

-   [Bug Tracker](http://github.com/getsentry/raven-csharp/issues)
-   [GitHub Project](http://github.com/getsentry/raven-csharp)
-   [Join the chat on Gitter](https://gitter.im/getsentry/raven-csharp)
-   [Join the chat on IRC](irc://irc.freenode.net/sentry) (irc.freenode.net, #sentry)

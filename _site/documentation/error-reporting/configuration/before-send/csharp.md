A `Func<SentryEvent, SentryEvent>` can be used to mutate, discard (return null), or return a completely new event.

```csharp
using Sentry;

SentrySdk.Init(o =>
{
    o.BeforeSend = sentryEvent =>
    {
        // Modify the event here:
        sentryEvent.ServerName = null; // Don't send server names.
        return sentryEvent;
    };
});
```

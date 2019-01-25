```csharp
using (SentrySdk.Init(o =>
{
    o.BeforeSend = @event =>
    {
        if (@event.Exception is SqlConnection ex)
        {
            @event.SetFingerprint(new [] { "database-connection-error" });
        }

        return @event;
    };
}
```

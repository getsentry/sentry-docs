```csharp
using Sentry;
using Sentry.Protocol;

SentrySdk.WithScope(scope =>
{
    scope.SetTag("my-tag", "my value");
    scope.Level = SentryLevel.Warning;
    // will be tagged with my-tag="my value"
    SentrySdk.CaptureException(new Exception("my error"));
});

// will not be tagged with my-tag
SentrySdk.CaptureException(new Exception("my other error"));
```

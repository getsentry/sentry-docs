```csharp
using Sentry;
using Sentry.Protocol;

SentrySdk.WithScope(scope =>
{
    scope.SetTag("my-tag", "my value");
    scope.Level = SentryLevel.Warning;
    SentrySdk.CaptureException(new Exception("my error"));
});
```

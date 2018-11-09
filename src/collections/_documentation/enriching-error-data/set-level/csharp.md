```csharp
using Sentry;

SentrySdk.ConfigureScope(scope =>
{
    scope.Level = SentryLevel.Warning;
});
```

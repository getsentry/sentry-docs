```csharp
using Sentry;

SentrySdk.ConfigureScope(scope =>
{
    scope.SetFingerprint(new[] { "my-view-function" });
});
```

```csharp
using Sentry;

SentrySdk.Init(o => o.Release = "{{ page.release_identifier }}");
```

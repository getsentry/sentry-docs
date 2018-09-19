```csharp
using Sentry;

SentrySdk.AddBreadcrumb(
    message: "Authenticated user " + user.email,
    category: "auth",
    level: BreadcrumbLevel.Info);
```

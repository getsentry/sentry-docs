```csharp
using Sentry;

SentrySdk.Init(options =>
{
    options.BeforeBreadcrumb = breadcrumb
        // Ignore breadcrumbs from Spammy logger
        => breadcrumb.Category == "Spammy.Logger"
            ? null
            : breadcrumb;
});
```

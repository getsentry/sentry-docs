```csharp
using Sentry;

SentrySdk.ConfigureScope(scope => 
{
    scope.SetExtra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}");
});
```

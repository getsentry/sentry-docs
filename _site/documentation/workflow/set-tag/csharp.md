```csharp
using Sentry;

SentrySdk.ConfigureScope(scope => 
{
    scope.SetTag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}");
});
```

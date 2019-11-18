```csharp
using Sentry;

SentrySdk.ConfigureScope(scope => 
{
    scope.SetExtra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}");

    // to set multiple key-value pairs at once:
    scope.SetExtras(
        new List<KeyValuePair<string, object>>{
            new KeyValuePair<string, object>(
                "{{ page.example_extra_key }}",
                "{{ page.example_extra_value }}"
            ),
            new KeyValuePair<string, object>(
                "{{ page.example_extra_key2 }}",
                "{{ page.example_extra_value2 }}"
            ),
        }
    );
});
```

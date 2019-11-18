```csharp
using Sentry;

SentrySdk.ConfigureScope(scope => 
{
    scope.SetTag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}");

    // to set multiple key-value pairs at once:
    scope.SetTags(
        new List<KeyValuePair<string, object>>{
            new KeyValuePair<string, object>(
                "{{ page.example_tag_name }}",
                "{{ page.example_tag_value }}"
            ),
            new KeyValuePair<string, object>(
                "{{ page.example_tag_name2 }}",
                "{{ page.example_tag_value2 }}"
            ),
        }
    );
});
```

```javascript
Sentry.configureScope(function(scope) {
  scope.setTag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}");
  
  // to set multiple key-value pairs at once:
  scope.setTags({
    {{ page.example_tag_name }}: "{{ page.example_tag_value }}",
    {{ page.example_tag_name2 }}: "{{ page.example_tag_value2 }}",
  });
});
```

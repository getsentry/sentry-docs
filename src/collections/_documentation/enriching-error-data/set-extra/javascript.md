```javascript
Sentry.configureScope(function(scope) {
  scope.setExtra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}");
});
```

```javascript
Sentry.configureScope((scope) => {
  scope.setTag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}");
});
```
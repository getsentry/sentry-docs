```javascript
Sentry.configureScope((scope) => {
  scope.setExtra("{{ page.example_extra_key }}": "{{ page.example_extra_value }}");
});
```

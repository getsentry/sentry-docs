```javascript
Sentry.configureScope(function(scope) {
  scope.setUser({"email": "{{ page.example_user_email }}"});
});
```

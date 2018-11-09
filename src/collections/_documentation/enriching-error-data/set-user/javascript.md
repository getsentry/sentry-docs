```javascript
Sentry.configureScope((scope) => {
  scope.setUser({"email": "{{ page.example_user_email }}"});
});
```

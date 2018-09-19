```javascript
Sentry.withScope(scope => {
  scope.setTag("my-tag", "my value");
  scope.setLevel('warning');
  Sentry.captureException(new Error('my error'));
});
```

```javascript
Sentry.withScope(function(scope) {
  scope.setTag("my-tag", "my value");
  scope.setLevel('warning');
  // will be tagged with my-tag="my value"
  Sentry.captureException(new Error('my error'));
});

// will not be tagged with my-tag
Sentry.captureException(new Error('my other error'));
```

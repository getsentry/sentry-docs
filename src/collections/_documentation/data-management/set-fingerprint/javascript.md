```javascript
Sentry.configureScope(function(scope) {
  scope.setFingerprint(['my-view-function']);
});
```
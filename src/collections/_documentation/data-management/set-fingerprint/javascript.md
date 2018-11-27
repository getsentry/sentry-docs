```javascript
Sentry.configureScope((scope) => {
  scope.setFingerprint(['my-view-function']);
});
```
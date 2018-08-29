```javascript
using Sentry;

SentrySdk.ConfigureScope(scope => {
    scope.SetTag("my-tag", "my value");
    scope.User = new User {
        Id = "42",
        Email = "john.doe@example.com"
    };
});
```

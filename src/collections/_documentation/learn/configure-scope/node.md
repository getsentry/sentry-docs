```javascript
const { configureScope } = require("@sentry/node");

configureScope((scope) => {
  scope.setTag("my-tag", "my value");
  scope.setUser({
    id: 42,
    email: "john.doe@example.com"
  });
});
```

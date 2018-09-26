In Javascript a function can be used to modify the event or return a completely new one. If you return `null`, the event will be discarded.

```javascript
Sentry.init({
  beforeSend(event) {
    // Modify the event here
    if (event.user) {
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});
```

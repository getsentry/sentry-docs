In JavaScript you can pass an error object to `captureException()` to get it captured
as event.  Note that it's possible to throw strings as errors in which case no traceback
can be recorded.

```javascript
try {
    aFunctionThatMightFail();
} catch (err) {
    Sentry.captureException(err);
}
```

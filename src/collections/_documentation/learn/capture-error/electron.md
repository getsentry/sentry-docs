In JavaScript you can pass an error object to `captureException()` to get it captured
as event.  Note that it's possible to throw strings as errors in which case no traceback
can be recorded.

```javascript
import { captureException } from '@sentry/electron';

try {
    aFunctionThatMightFail();
} catch (err) {
    captureException(err);
}
```

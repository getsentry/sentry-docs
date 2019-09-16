To capture an error or exception condition, create events containing an
exception object. It needs to contain at least a value and type:

```cpp
#include <sentry.h>

sentry_value_t exc = sentry_value_new_object();
sentry_value_set_by_key(exc, "type", sentry_value_new_string("Exception"));
sentry_value_set_by_key(exc, "value", sentry_value_new_string("Error message."));

sentry_value_t event = sentry_value_new_event();
sentry_value_set_by_key(event, "exception", exc);
sentry_capture_event(event);
```

This exception does not contain a stack trace, which must be added separately.

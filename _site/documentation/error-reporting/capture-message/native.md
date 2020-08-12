```c
#include <sentry.h>

sentry_value_t event = sentry_value_new_event();
sentry_value_set_by_key(event, "message", sentry_value_new_string("Hello!"));
sentry_capture_event(event);
```

In C/C++ you can capture errors by creating events containing the type and value
of an exception. For example, C++ standard exceptions can be captured by
creating an exception object using the type and value of the exception:

```cpp
#include <exception>
#include <typeinfo>
#include <sentry.h>

try {
  /* some code that can throw */
} catch (const std::exception &e) {
  sentry_value_t exc = sentry_value_new_object();
  sentry_value_set_by_key(exc, "type", sentry_value_new_string(typeid(e).name()));
  sentry_value_set_by_key(exc, "value", sentry_value_new_string(e.what()));

  sentry_value_t event = sentry_value_new_event();
  sentry_value_set_by_key(event, "exception", exc);
  sentry_capture_event(event);
}
```

This exception does not contain a stack trace, which must be added separately.

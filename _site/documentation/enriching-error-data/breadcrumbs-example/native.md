```c
#include <sentry.h>

sentry_value_t crumb = sentry_value_new_breadcrumb("default", "Authenticated user");
sentry_value_set_by_key(crumb, "category", sentry_value_new_string("auth"));
sentry_value_set_by_key(crumb, "level", sentry_value_new_string("info"));
sentry_add_breadcrumb(crumb);
```

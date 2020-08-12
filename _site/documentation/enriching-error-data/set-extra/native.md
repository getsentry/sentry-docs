```c
#include <sentry.h>

sentry_value_t extra_value = sentry_value_new_string("{{ page.example_extra_value }}");
sentry_set_extra("{{ page.example_extra_key }}", screen);
```

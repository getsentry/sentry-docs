```c
#include <sentry.h>

sentry_options_t *options = sentry_options_new();
sentry_options_set_release(options, "{{ page.release_identifier }}@{{ page.release_version }}");
sentry_init(options);
```

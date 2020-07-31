```c
#include <sentry.h>

sentry_value_t strip_sensitive_data(sentry_value_t event, void *hint) {
  /* modify event here or return NULL to discard the event */
  return event;
}

int main(void) {
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_before_send(options, strip_sensitive_data);
  sentry_init(options);

  /* ... */
}
```

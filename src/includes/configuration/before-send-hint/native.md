```c
#include <sentry.h>

sentry_value_t before_send(sentry_value_t event, void *hint) {
  /* inspect hint  and modify event here or return NULL to discard the event */
  return event;
}

int main(void) {
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_before_send(options, before_send);
  sentry_init(options);

  /* ... */
}
```

Import and initialize the Sentry SDK early in your application setup:

```c
#include <sentry.h>

int main(void) {
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_dsn(options, "___PUBLIC_DSN___");
  sentry_init(options);

  /* ... */

  // make sure everything flushes
  sentry_shutdown();
}
```

Alternatively, the DSN can be passed as `SENTRY_DSN` environment variable during
runtime. This can be especially useful for server applications.

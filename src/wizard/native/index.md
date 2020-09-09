---
name: Native (C/C++)
doc_link: https://docs.sentry.io/platforms/native/
support_level: production
type: language
---

Install the SDK by downloading the [latest release](https://github.com/getsentry/sentry-native/releases). Next, follow the
instructions in the [_Native SDK Documentation_](/platforms/native/) to build and link the SDK
library.

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

The quickest way to verify Sentry in your Native application is by capturing a message:

```c
sentry_capture_event(sentry_value_new_message_event(
  /*   level */ SENTRY_LEVEL_INFO,
  /*  logger */ "custom",
  /* message */ "It works!"
));
```

```c
#include <sentry.h>

sentry_shutdown();
```

Calling `sentry_shutdown()` before exiting the application is critical to avoid
data loss.

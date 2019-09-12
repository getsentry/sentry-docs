```cpp
#include <sentry.h>
#include <string>

class DatabaseConnectionError {};

int main() {
    try {
        /* some code that can throw */
    } catch (const DatabaseConnectionError &e) {
        sentry_value_t fingerprint = sentry_value_new_list();
        sentry_value_append(
            fingerprint, sentry_value_new_string("database-connection-error"));

        sentry_value_t event = sentry_value_new_event();
        sentry_value_set_by_key(event, "fingerprint", fingerprint);
        /* add more attributes... */
        sentry_capture_event(event);
    }
}
```

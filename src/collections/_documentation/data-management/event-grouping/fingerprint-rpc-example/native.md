```cpp
#include <string>
#include <sentry.h>

class MyRpcError {
   public:
    std::string function;
    std::string error_code;

    MyRpcError(std::string function, std::string error_code)
        : function(function), error_code(error_code) {
    }
};

int main() {
    /* some code that emits MyRpcError */
    MyRpcError e(/* ... */);
    
    sentry_value_t fingerprint = sentry_value_new_list();
    sentry_value_append(fingerprint, sentry_value_new_string("{% raw %}{{ default }}{% endraw %}"));
    sentry_value_append(fingerprint, sentry_value_new_string(e.function.c_str()));
    sentry_value_append(fingerprint, sentry_value_new_string(e.error_code.c_str()));

    sentry_value_t event = sentry_value_new_event();
    sentry_value_set_by_key(event, "fingerprint", fingerprint);
    /* add more attributes... */
    sentry_capture_event(event);
}
```

```rust
use sentry;

sentry::init(sentry::ClientOptions {
    release: "{{ page.release_identifier }}"
});
```

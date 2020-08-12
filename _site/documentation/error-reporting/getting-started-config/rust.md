`sentry.init()` will return you a guard that when freed, will prevent process exit until all events have been sent (within a timeout):

```rust
let _guard = sentry::init("___PUBLIC_DSN___");
```

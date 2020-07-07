When the Rust SDK initializes a guard is returned from the `init` function.  The destructor
will automatically wait `shutdown_timeout` seconds.  This means you just need to hold on to
the guard and make sure it disposes on shutdown.  Alternatively the client can be closed:

```rust
use std::time::Duration;

if let Some(client) = sentry::Hub::current().client() {
    client.close(Some(Duration::from_secs(2)));
}
```

After a call to `close`, the client cannot be used anymore. It's important to
only call `close` immediately before shutting down the application.

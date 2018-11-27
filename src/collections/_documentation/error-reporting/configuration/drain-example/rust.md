When the Rust SDK initializes a guard is returned from the `init` function.  The destructor
will automatically wait `shutdown_timeout` seconds.  This means you just need to hold on to
the guard and make sure it disposes on shutdown.  Alternatively the client can be closed:

```javascript
use std::time::Duration;
use sentry::Hub;

if let Some(client) = Hub.current().client() {
    client.close(Some(Duration::from_secs(2)));
}
```

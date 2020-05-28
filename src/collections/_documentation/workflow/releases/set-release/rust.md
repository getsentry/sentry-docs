```rust
use sentry;

let _guard = sentry::init((
    "___PUBLIC_DSN___",
    sentry::ClientOptions {
        release: Some("{{ page.release_identifier }}@{{ page.release_version }}".into()),
        ..Default::default()
    },
));

```

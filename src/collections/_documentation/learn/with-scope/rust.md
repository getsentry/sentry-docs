```rust
use sentry::{Level, with_scope};
use sentry::integrations::failure::capture_error;
use failure::err_msg;

with_scope(|scope| {
    scope.set_tag("my-tag", "my value");
    scope.set_level(Some(Level::Warning));
}, || {
    capture_error(err_msg("my error"))
});
```

*Note that in Rust two callbacks are invoked.  One for configuring the scope, and a second
which is executed in the context of the scope.*

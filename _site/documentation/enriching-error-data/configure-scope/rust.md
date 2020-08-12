```rust
use sentry::{configure_scope, User};

configure_scope(|scope| {
    scope.set_tag("my-tag", "my value");
    scope.set_user(Some(User {
        id: Some(42.to_string()),
        email: Some("john.doe@exmaple.com".into()),
        ..Default::default()
    }));
});
```

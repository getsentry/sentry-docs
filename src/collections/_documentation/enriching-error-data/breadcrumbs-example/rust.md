```rust
use sentry::{add_breadcrumb, Breadcrumb, Level};

add_breadcrumb(Breadcrumb {
    category: Some("auth".into()),
    message: Some(format!("Authenticated user {}", user.email)),
    level: Level::Info,
    ..Default::default()
});
```

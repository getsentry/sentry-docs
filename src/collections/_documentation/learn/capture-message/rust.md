```rust
use sentry::{capture_message, Level};

capture_message("Something went wrong", Level::Info);
```

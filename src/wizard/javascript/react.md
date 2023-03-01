---
name: React
doc_link: https://docs.sentry.io/platforms/javascript/guides/react/
support_level: production
type: framework
---
In this quick guide you’ll set up:
- `@sentry/react` for [error monitoring](https://docs.sentry.io/platforms/javascript/guides/react/)
- `@sentry/tracing` for [performance monitoring](https://docs.sentry.io/platforms/javascript/guides/react/performance/)

---

## Install
Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/react @sentry/tracing

# Using npm
npm install --save @sentry/react @sentry/tracing
```

## Configure
Initialise Sentry as early as possible in your application's lifecycle.

```javascript
import { createRoot } React from "react-dom/client";
import React from "react";  
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />)
```

> **tracesSampleRate: 1.0**
> The example above ensures every transaction will be to Sentry, but we recommend lowering this value in production.

## Verify
This snippet includes an intentional error, so you can test that everything is working as soon as you set it up.

```javascript
return <button onClick={() => methodDoesNotExist()}>Break the world</button>;
```

---
## Next Steps
- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [React Features](https://docs.sentry.io/platforms/javascript/guides/react/features/): Learn about our first class integration with the React framework.
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/react/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.

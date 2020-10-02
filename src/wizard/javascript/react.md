---
name: React
doc_link: https://docs.sentry.io/platforms/javascript/guides/react/
support_level: production
type: framework
---

To instrument your React application with Sentry, first install the `@sentry/react` and `@sentry/tracing` packages:

```bash
# Using yarn
$ yarn add @sentry/react @sentry/tracing

# Using npm
$ npm install --save @sentry/react @sentry/tracing
```

Next, import and initialize the Sentry module as early as possible, before initializing React:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./App";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById("root"));

// Can also use with React Concurrent Mode
// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

After this step, Sentry will report any uncaught exceptions triggered by your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button whose `onClick` handler attempts to invoke a method that does not exist:

```jsx
return <button onClick={methodDoesNotExist}>Break the world</button>;
```

Once you've verified the library is initialized properly and sent a test event, consider visiting our [complete React docs](https://docs.sentry.io/platforms/javascript/guides/react/). There you'll find additional instructions for surfacing valuable context from React error boundaries, React Router, Redux, and more.
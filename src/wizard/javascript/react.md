---
name: React
doc_link: https://docs.sentry.io/platforms/javascript/guides/react/
support_level: production
type: framework
---

To use Sentry with your React application, you will need to use `@sentry/react` (Sentry’s Browser React SDK).

<div class="alert alert-info" role="alert"><h5 class="no_toc">Note</h5><div class="alert-body content-flush-bottom">`@sentry/react` is a wrapper around the `@sentry/browser` package, with added functionality related to React. All methods available in the `@sentry/browser` package can also be imported from `@sentry/react`.</div>
</div>

Add the Sentry SDK as a dependency using yarn or npm:

```bash
# Using yarn
$ yarn add @sentry/react @sentry/apm

# Using npm
$ npm install @sentry/react @sentry/apm
```

## Connecting the SDK to Sentry

After you've completed setting up a project in Sentry, Sentry will give you a value which we call a _DSN_ or _Data Source Name_. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing React:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/apm';
import App from './App';

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Integrations.Tracing(),
  ],
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById("root"));
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

On its own, `@sentry/react` will report any uncaught exceptions triggered by your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button:

```jsx
return <button onClick={methodDoesNotExist}>Break the world</button>;
```

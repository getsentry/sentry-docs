To get started with performance monitoring using Sentry's JavaScript SDK, first install the `@sentry/apm` package:

```bash
npm install --save @sentry/apm
```

Next, initialize the integration in your call to `Sentry.init`:

```jsx
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';
Sentry.init({
  dsn: '"___PUBLIC_DSN___"',
  release: 'my-project-name@' + process.env.npm_package_version,
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25, // must be present and non-zero
});
```

Performance data is transmitted using a new event type called "transactions", which you can learn about in [Distributed Tracing](/performance/distributed-tracing/#traces-transactions-and-spans). **To capture transactions, you must install the performance package and configure your SDK to set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured transactions.

Learn more about sampling in [Using Your SDK to Filter Events](/error-reporting/configuration/filtering/).

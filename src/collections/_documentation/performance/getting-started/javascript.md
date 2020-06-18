## Getting Started with Performance for JavaScript

To get started with performance monitoring, first install the `@sentry/tracing` package:

```bash
npm install --save @sentry/tracing
```

Next, initialize the integration in your call to `Sentry.init`:

```jsx
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/tracing';
Sentry.init({
  dsn: '"___PUBLIC_DSN___"',
  release: 'my-project-name@' + process.env.npm_package_version,
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25, // must be present and non-zero
});
```

Performance data is transmitted using a new event type called "transactions", which you can learn about in [Distributing Tracing]({%- link _documentation/performance/distributed-tracing.md %}#traces-transactions-and-spans). **To sample transactions, you must set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured transactions.

Learn more about sampling in [Using Your SDK to Filter Events]({%- link _documentation/error-reporting/configuration/filtering.md %}).
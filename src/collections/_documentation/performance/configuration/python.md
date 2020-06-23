To get started with performance monitoring using Sentry's Python SDK, first install the `@sentry/apm` package:

```
import sentry_sdk
```

Next, initialize the integration in your call to `Sentry.init`:

```
sentry_sdk.init(
    "___PUBLIC_DSN___", 
    traces_sample_rate = 0.25
)
```

Performance data is transmitted using a new event type called "transactions", which you can learn about in [Distributed Tracing]({%- link _documentation/performance/distributed-tracing.md %}#traces-transactions-and-spans). **To capture transactions, you must install the performance package and configure your SDK to set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured traces.

Learn more about sampling in [Using Your SDK to Filter Events]({%- link _documentation/error-reporting/configuration/filtering.md %}).
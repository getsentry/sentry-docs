Use the generic integration by calling the `serverless_function` decorator. Decorators wrap a function and modify its behavior. Then, deploy and test the function. Checkout Sentry's [sample apps](https://github.com/getsentry/examples) for detailed examples.


## Behavior

- Each call of a decorated function will block and wait for current events to be sent before returning. When there are no events to be sent, no delay is added. However, if there are errors, it will delay the return of your serverless function until the events are sent. This is necessary as serverless environments typically reserve the right to kill the runtime/VM when they consider it is unused.
- You can add more context as described [here](/platforms/python#setting-context).
- {% include platforms/python/request-data.md %}

The maximum amount of time to block overall is set by the [`shutdown_timeout` client option](/error-reporting/configuration?platform=python#shutdown-timeout).

You can disable this aspect by decorating with `@serverless_function(flush=False)` instead.

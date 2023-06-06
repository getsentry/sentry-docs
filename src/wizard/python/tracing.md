---
name: Python
doc_link: https://docs.sentry.io/platforms/python/performance/
support_level: production
type: language
---

The Sentry SDK for Python does a very good job of auto instrumenting your application. Here a short introduction on how to do custom performance instrumentation. If you'd like to learn more, read our [custom instrumentation](https://docs.sentry.io/platforms/python/performance/instrumentation/custom-instrumentation/) documentation.

**Adding a Transaction**

Adding transactions will allow you to instrument and capture certain regions of your code.

<Note>

If you're using one of Sentry's SDK integrations, transactions will be created for you automatically.

</Note>

The following example creates a transaction for an expensive operation (in this case,`eat_pizza`), and then sends the result to Sentry:

```python
import sentry_sdk

def eat_slice(slice):
    ...

def eat_pizza(pizza):
    with sentry_sdk.start_transaction(op="task", name="Eat Pizza"):
        while pizza.slices > 0:
            eat_slice(pizza.slices.pop())
```

**Adding More Spans to the Transaction**

If you want to have more fine-grained performance monitoring, you can add child spans to your transaction, which can be done by either:

- Using a context manager or
- Using a decorator, (this works on sync and `async` functions)

Calling a `sentry_sdk.start_span()` will find the current active transaction and attach the span to it.

```python {tabTitle:Context Manager}
import sentry_sdk

def eat_slice(slice):
    ...

def eat_pizza(pizza):
    with sentry_sdk.start_transaction(op="task", name="Eat Pizza"):
        while pizza.slices > 0:
            with sentry_sdk.start_span(description="Eat Slice"):
                eat_slice(pizza.slices.pop())

```

```python {tabTitle:Decorator}
import sentry_sdk

@sentry_sdk.trace
def eat_slice(slice):
    ...

def eat_pizza(pizza):
    with sentry_sdk.start_transaction(op="task", name="Eat Pizza"):
        while pizza.slices > 0:
            eat_slice(pizza.slices.pop())

```

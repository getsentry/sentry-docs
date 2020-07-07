---
hide_from_sidebar: true
---

To get started with performance monitoring using Sentry's Python SDK, first install `sentry_sdk`:

```python
import sentry_sdk
```

Next, initialize the integration in your call to `sentry_sdk.init`:

```python
sentry_sdk.init(
    "___PUBLIC_DSN___", 
    traces_sample_rate = 0.25
)
```

Performance data is transmitted using a new event type called "transactions," which you can learn about in [Distributed Tracing](/performance-monitoring/distributed-tracing/#traces-transactions-and-spans). **To capture transactions, you must install and configure your SDK to set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured traces.

Learn more about sampling in [Using Your SDK to Filter Events](/error-reporting/configuration/filtering/).

**Python**

To send traces, set the `traces_sample_rate` to a nonzero value. The following configuration will capture 25% of your transactions:

```python
import sentry_sdk

sentry_sdk.init(
    "___PUBLIC_DSN___", 
    traces_sample_rate = 0.25
)
```

**Automatic Instrumentation**

Many integrations for popular frameworks automatically capture transactions. If you already have any of the following frameworks set up for Sentry error reporting, you will start to see traces immediately:

- All WSGI-based web frameworks (Django, Flask, Pyramid, Falcon, Bottle)
- Celery
- AIOHTTP web apps
- Redis Queue (RQ)

Spans are instrumented for the following operations within a transaction:

- Database queries that use SQLAlchemy or the Django ORM
- HTTP requests made with `requests` or the `stdlib`
- Spawned subprocesses
- Redis operations

If you want to automatically enable all relevant transactions, you can use this alternative configuration (currently in alpha):

```python
import sentry_sdk

sentry_sdk.init(
    "___PUBLIC_DSN___",
    _experiments={"auto_enabling_integrations": True}
)
```

**Manual Instrumentation**

<!-- WIZARD python-tracing -->

To manually instrument certain regions of your code, you can create a transaction to capture them.

The following example creates a transaction for a scope that contains an expensive operation (for example, `process_item`), and sends the result to Sentry:

```python
from sentry_sdk import start_transaction

while True:
  item = get_from_queue()

  with start_transaction(op="task", name=item.get_transaction_name()):
      # process_item may create more spans internally (see next examples)
      process_item(item)
```

**Adding More Spans to the Transaction**

The next example contains the implementation of the hypothetical `process_item` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add all newly created spans as child operations to that transaction. Keep in mind that each individual span also needs to be manually finished; otherwise, spans will not show up in the transaction. When using spans and transactions as context managers, they are automatically finished at the end of the `with` block.

In cases where you want to attach Spans to an already ongoing Transaction you can use `Hub.current.scope.transaction`. This property will return a `Transaction` in case there is a running Transaction otherwise it returns `None`.

Alternatively, instead of adding to the top-level transaction, you can make a child span of the current span, if there is one. Use ``Hub.current.scope.span` in that case.

You can choose the value of `op` and `description`.

```python
from sentry_sdk import Hub

def process_item(item):
    transaction = Hub.current.scope.transaction
    # omitted code...
    with transaction.start_child(op="http", description="GET /") as span:
        response = my_custom_http_library.request("GET", "/")
        span.set_tag("http.status_code", response.status_code)
        span.set_data("http.foobarsessionid", get_foobar_sessionid())
```

The alternative to make a tree of spans:

```python
from sentry_sdk import Hub

def process_item(item):
    parent_span = Hub.current.scope.span
    # omitted code...
    with parent_span.start_child(op="http", description="GET /") as span:
        response = my_custom_http_library.request("GET", "/")
        span.set_tag("http.status_code", response.status_code)
        span.set_data("http.foobarsessionid", get_foobar_sessionid())
```

<!-- ENDWIZARD -->

#### Retrieving a Transaction

In cases where you want to attach Spans to an already ongoing Transaction you can use `Hub.current.scope.transaction`. This property will return a `Transaction` in case there is a running Transaction otherwise it returns `None`.

```python
from sentry_sdk import Hub

transaction = Hub.current.scope.transaction

if transaction is None:
    with start_transaction(name="task"):
        do_task()
else:
    transaction.name = "new name"
    with transaction.start_child(op="task"):
        do_task()
```

#### Retrieving the current Span

Started spans are stored in the scope, and can be fetched off the scope:

```python
from sentry_sdk import Hub

span = Hub.current.scope.span

if span is None:
    # no span in progress, create new transaction
    with start_transaction(name="task"):
        do_task()
else:
    # new task span as child of current span
    with span.start_child(op="task"):
        do_task()
```

**Adding Query Information and Parameters to Spans**

Currently, every tag has a maximum character limit of 200 characters. Tags over the 200 character limit will become truncated, losing potentially important information. To retain this data, you can split data over several tags instead.

For example, a 200+ character tagged request:

`https://empowerplant.io/api/0/projects/ep/setup_form/?user_id=314159265358979323846264338327&tracking_id=EasyAsABC123OrSimpleAsDoReMi&product_name=PlantToHumanTranslator&product_id=161803398874989484820458683436563811772030917980576`

The 200+ character request above will become truncated to:

`https://empowerplant.io/api/0/projects/ep/setup_form/?user_id=314159265358979323846264338327&tracking_id=EasyAsABC123OrSimpleAsDoReMi&product_name=PlantToHumanTranslator&product_id=1618033988749894848`

Instead, using `span.set_tag` splits the details of this query over several tags. This could be done over `base_url`, `endpoint`, `parameters`, in this case, resulting in three different tags:
```python
import sentry_sdk
...
with sentry_sdk.start_transaction(op="request", name="setup form") as transaction:
    transaction.set_tag("base_url", base_url)
    transaction.set_tag("endpoint", endpoint)
    transaction.set_tag("parameters", parameters)
    make_request(
        "{base_url}/{endpoint}/".format(
            base_url=base_url,
            endpoint=endpoint,
        ),
        data=parameters
    )
    ...
```

base_url

: `https://empowerplant.io`

endpoint

: `api/0/projects/ep/setup_form`

parameters

: ```json
    {
        "user_id": 314159265358979323846264338327,
        "tracking_id": "EasyAsABC123OrSimpleAsDoReMi",
        "product_name": "PlantToHumanTranslator",
        "product_id": 161803398874989484820458683436563811772030917980576,
    }
```

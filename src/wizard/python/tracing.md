---
name: Python
doc_link: https://docs.sentry.io/performance-monitoring/getting-started/?platform=python
support_level: production
type: language
---
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

Alternatively, instead of adding to the top-level transaction, you can make a child span of the current span, if there is one. Use `Hub.current.scope.span` in that case.

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

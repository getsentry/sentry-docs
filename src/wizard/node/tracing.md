---
name: Node.js
doc_link: https://docs.sentry.io/platforms/node/performance/
support_level: production
type: framework
---

To manually instrument a specific region of your code, you can create a transaction to capture it.

The following example creates a transaction for a part of the code that contains an expensive operation (for example, `processItem`), and sends the result to Sentry:

```javascript
app.use(function processItems(req, res, next) {
  const item = getFromQueue();
  const transaction = Sentry.startTransaction({
    op: "task",
    name: item.getTransaction(),
  });

  // processItem may create more spans internally (see next examples)
  processItem(item, transaction).then(() => {
    transaction.finish();
    next();
  });
});
```

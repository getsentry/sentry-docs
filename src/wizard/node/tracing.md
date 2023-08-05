---
name: Node.js
doc_link: https://docs.sentry.io/platforms/node/performance/instrumentation/custom-instrumentation/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

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

---
name: React-Native
doc_link: https://docs.sentry.io/platforms/react-native/performance/instrumentation/custom-instrumentation/
support_level: production
type: language
---

To manually instrument certain regions of your code, you can create a transaction to capture them.

```javascript
const transaction = Sentry.startTransaction({ name: "test-transaction" });
const span = transaction.startChild({ op: "functionX" }); // This function returns a Span
// functionCallX
span.finish(); // Remember that only finished spans will be sent with the transaction
transaction.finish(); // Finishing the transaction will send it to Sentry
```

---
title: 'Sampling'
sidebar_order: 1
---

In some situations you may want to sample data within Sentry. This is a valuable tool if you're concerned about the cost of Sentry, or if some data is naturally very high volume and noisy (like [_Security Policy Reports_]({%- link _documentation/error-reporting/security-policy-reporting.md -%})).

All of Sentry's SDKs provide a `sampleRate` configuration. For example, in JavaScript:

```javascript
Sentry.init({
  // ...
  sampleRate: 0.5, // send 50% of events
});
```

The sample rate representing the percentage of events to be sent in the range of `0.0` to `1.0`. The default is `1.0` which means that 100% of events are sent. If set to 0.1 only 10% of events will be sent. Events are picked randomly.

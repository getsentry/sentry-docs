---
title: Sentry Testkit
sidebar_order: 30002
---

When building tests for your application, you want to assert that the right flow-tracking or error is being sent to *Sentry*, **but** without really sending it to *Sentry* servers. This way you won't swamp Sentry with false reports during test running and other CI operations.

### This is where Sentry Testkit comes in!
[Sentry Testkit](https://wix.github.io/sentry-testkit/) is a Sentry plugin to allow intercepting Sentry's report and further inspection of the data being sent. It enables Sentry to work natively in your application, and by overriding the default Sentry transport mechanism, the report is not really sent but rather logged locally into memory. In this way, the logged reports can be fetched later for your own usage, verification, or any other use you may have in your local developing/testing environment.

### Getting Started
#### Installation
```
npm install sentry-testkit --save-dev
```

#### Using in tests
```javascript
const sentryTestkit = require('sentry-testkit')

const { testkit, sentryTransport } = sentryTestkit()

// initialize your Sentry instance with sentryTransport
Sentry.init({
    dsn: 'some_dummy_dsn',
    transport: sentryTransport,
    //... other configurations
})

// then run any scenario that should call Sentry.catchException(...)

expect(testKit.reports()).toHaveLength(1)
const report = testKit.reports()[0]
expect(report).toHaveProperty(...)
```

You may see more usage examples in the testing section of this repository as well.

#### Test Kit API
Sentry testkit consists of a very simple and strait-forward API.
See full API description and documentation in [Sentry Testkit Docs](https://wix.github.io/sentry-testkit/)

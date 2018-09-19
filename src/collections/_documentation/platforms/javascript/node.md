---
title: Node
sidebar_order: 1000
---

{% include learn-sdk.md platform="node" %}

### Running on serverless architecture

If you are running our SDK in a serverless architecture like AWS Lambda, Google Cloud Functions you might want to wait until all errors are sent.
Here is an example, specific to node to wait for 2000ms for the request buffer to drain.

```javascript
import { getCurrentHub } from '@sentry/node';

getCurrentHub().getClient().close(2000).then(result => {
    if (!result) {
        console.log('We reached the timeout for emptying the request buffer, still exiting now!');
    }
    global.process.exit(1);
})
```
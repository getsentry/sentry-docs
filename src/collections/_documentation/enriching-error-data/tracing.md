---
title: Tracing
sidebar_order: 5
---

With tracing, you can correlate errors from multiple services and uncover a significant story surrounding a break. Using a unique identifier allows you to trace an error and pinpoint the service and code behaving unexpectedly. 

## Tracing and Sentry Configuration
The following steps demonstrate a potential use-case that involves an example web application with a JavaScript front-end and a Node.js server. The examples assume that both services are already configured with Sentry's [JavaScript SDK]({% link _documentation/platforms/javascript/index.md %}).

#### Step 1: Generate a unique transaction ID
Generate a unique transaction identifier and set as a Sentry tag in the service issuing the request. This unique identifier could be a transaction ID or a session ID created when the web application first loads. Set this value as a Sentry tag using the Sentry SDK. Below, the example uses a `transactionId` as a unique identifier:

```javascript
// generate unique transactionId and set as Sentry tag
const transactionId = Math.random().toString(36).substr(2, 9);
Sentry.configureScope(scope => {
    scope.setTag("transaction_id", transactionId);
});
```

#### Step 2: Set the transaction ID
When initiating the request, set the transaction identifier as a custom request header. If the request fails, handle it in such a way that Sentry's SDK will collect the error (either manually throw it, or capture it using `Sentry.captureError` or `Sentry.captureMessage`).

```javascript
// perform request (set transctionId as header and throw error appropriately)
fetch('https://my.artisanal-hot-dogs.com/checkout', {  
    method: 'POST',  
    headers: {  
      "X-Transaction-ID": transactionId  
    },  
    body: order
})
.then(function (response) {
    if (response.status !== 200) {
        throw new Error(response.status + " - " + response.statusText);
    }
})  
.catch(function (error) {  
    throw error;  
});
``` 

#### Step 3: Parse the transaction header
In the receiving service (the server responding to the request), extract the unique identifier, in our case `transactionId` customer header, and set it as a Sentry tag. Both services should have set the same tag key/value pair.

```javascript
let transactionId = request.header('X-Transaction-ID');

if (transactionId) {
    Sentry.configureScope(scope => {
        scope.setTag("transaction_id", transactionId);
    });
}
```




To get started with performance monitoring using Sentry's JavaScript SDK, first install the `@sentry/browser` and `@sentry/apm` packages:

```bash
# Using yarn
$ yarn add @sentry/browser @sentry/apm

# Using npm
$ npm install @sentry/browser @sentry/apm
```

Alternatively, instead of npm packages, you can use our pre-built CDN bundle that combines both `@sentry/browser` and `@sentry/apm`:

```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.apm.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.apm.min.js %}" crossorigin="anonymous"></script>
```

Next, initialize the integration in your call to `Sentry.init`:

```jsx
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  release: 'my-project-name@' + process.env.npm_package_version,
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25, // must be present and non-zero
});
```

Performance data is transmitted using a new event type called "transactions," which you can learn about in [Distributed Tracing](/performance-monitoring/distributed-tracing/#traces-transactions-and-spans). **To capture transactions, you must install the performance package and configure your SDK to set the `tracesSampleRate` configuration to a nonzero value.** The example configuration above will transmit 25% of captured transactions.

Learn more about sampling in [Using Your SDK to Filter Events](/error-reporting/configuration/filtering/).


**Automatic Instrumentation**

For `@sentry/browser`, we provide an integration called `Tracing` that does automatic instrumentation in the browser. The `Tracing` integration creates `pageload` and `navigation` transactions containing spans for XHR/fetch requests and Performance API entries such as marks, measures, and resource timings.

The `Tracing` integration is specific to `@sentry/browser` and does not work with `@sentry/node`.

The `Tracing` integration resides in the `@sentry/apm` package. You can add it to your `Sentry.init` call:

```javascript
// Without CDN

import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25,
});

// With CDN

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25,
});
```

*NOTE:* The `Tracing` integration is available under `Sentry.Integrations.Tracing` when using the CDN bundle.

To send traces, you will need to set the `tracesSampleRate` to a nonzero value. The configuration above will capture 25% of your transactions.

By default, the `pageload` and `navigation` transactions set a transaction name using `window.location.pathname`.

You can pass many different options to the `Tracing` integration (as an object of the form `{optionName: value}`), but it comes with reasonable defaults out of the box.

For all possible options, see [TypeDocs](https://getsentry.github.io/sentry-javascript/interfaces/apm.tracingoptions.html).

**tracingOrigins Option**

The default value of `tracingOrigins` is `['localhost', /^\//]`. The JavaScript SDK will attach the `sentry-trace` header to all outgoing XHR/fetch requests whose destination contains a string in the list or matches a regex in the list. If your frontend is making requests to a different domain, you will need to add it there to propagate the `sentry-trace` header to the backend services, which is required to link transactions together as part of a single trace.

*Example:*

- A frontend application is served from `example.com`
- A backend service is served from `api.example.com`
- The frontend application makes API calls to the backend
- Therefore, the option needs to be configured like this: `new ApmIntegrations.Tracing({tracingOrigins: ['api.example.com']})`
- Now outgoing XHR/fetch requests to `api.example.com` will get the `sentry-trace` header attached

*NOTE:* You need to make sure your web server CORS is configured to allow the `sentry-trace` header. The configuration might look like `"Access-Control-Allow-Headers: sentry-trace"`, but this depends a lot on your setup. If you do not allow the `sentry-trace` header, the request might be blocked.

**beforeNavigation Option**s

{% version_added 5.18.0 %}

For `pageload` and `navigation` transactions, the `Tracing` integration uses the browser's `window.location` API to generate a transaction name. To customize the name of the `pageload` and `navigation` transactions, you can supply a `beforeNavigation` option to the `Tracing` integration. This option allows you to pass in a function that takes in the location at the time of navigation and returns a new transaction name.

`beforeNavigation` is useful if you would like to leverage the routes from a custom routing library like `React Router` or if you want to reduce the cardinality of particular transactions.

```javascript
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new ApmIntegrations.Tracing({
      beforeNavigate: location => {
        // Here we are doing some basic parameter replacements, but we recommend
        // using your UI's routing library to find the matching route template here
        return location.pathname
          .replace(/\d+/g, '<digits>')
          .replace(/[a-f0-9]{32}/g, '<hash>');
      },
    }),
  ],
  tracesSampleRate: 0.25,
});
```

**Manual Instrumentation**

To manually instrument certain regions of your code, you can create a transaction to capture them.
This is valid for both JavaScript Browser and Node and works independently of the `Tracing` integration.

```javascript
const transaction = Sentry.startTransaction({name: 'test-transaction'});
const span = transaction.startChild({op: 'functionX'}); // This function returns a Span
// functionCallX
span.finish(); // Remember that only finished spans will be sent with the transaction
transaction.finish(); // Finishing the transaction will send it to Sentry
```

Here is a different example. If you want to create a transaction for a user interaction on your page, you need to do the following:

```javascript
// Let's say this function is invoked when a user clicks on the checkout button of your shop
shopCheckout() {
  // This will create a new Transaction for you
  const transaction = Sentry.startTransaction('shopCheckout');

  // Assume this function makes an xhr/fetch call
  const result = validateShoppingCartOnServer();

  const span = transaction.startChild({
    data: {
      result
    },
    op: 'task',
    description: `processing shopping cart result`,
  });
  processAndValidateShoppingCart(result);
  span.finish();

  transaction.finish();
}
```

This example will send a transaction `shopCheckout` to Sentry. The transaction will contain a `task` span that measures how long `processAndValidateShoppingCart` took. Finally, the call to `transaction.finish()` will finish the transaction and send it to Sentry.

**Adding Additional Spans to the Transaction**

The next example contains the implementation of the hypothetical `processItem ` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add to it all newly created spans as child operations. Keep in mind that each individual span needs to be manually finished; otherwise, that span will not show up in the transaction.

```javascript
function processItem(item, transaction) {
  const span = transaction.startChild({
    op: "http",
    description: "GET /"
  })

  return new Promise((resolve, reject) => {
    http.get(`/items/${item.id}`, (response) => {
      response.on('data', () => {});
      response.on('end', () => {
        span.setTag("http.status_code", response.statusCode);
        span.setData("http.foobarsessionid", getFoobarSessionid(response));
        span.finish();
        resolve(response);
      });
    });
  });
}
```

**Grouping Transactions**

When Sentry captures transactions, they are assigned a transaction name. This name is generally auto-generated by the Sentry SDK based on the framework integrations you are using. If you can't leverage the automatic transaction generation (or want to customize how transaction names are generated) you can use a global event processor that is registered when you initialize the SDK with your configuration.

An example of doing this in a node.js application:

```javascript
import { addGlobalEventProcessor } from '@sentry/node';

addGlobalEventProcess(event => {
  // if event is a transaction event
  if (event.type === "transaction") {
	event.transaction = sanitizeTransactionName(event.transaction);
  }
  return event;
});
```

For browser JavaScript applications using the `Tracing` integration, the `beforeNavigate` option  can be used to better group navigation/pageload transactions together based on URL.

```javascript
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

Sentry.init({
	// ...
  integrations: [
    new ApmIntegrations.Tracing({
      beforeNavigate: (location) => {        
        // You could use your UI's routing library to find the matching
		    // route template here. We don't have one right now, so do some basic
		    // parameter replacements.
        return location.pathname
        .replace(/\d+/g, '<digits>')
        .replace(/[a-f0-9]{32}/g, '<hash>');
      },
    }),
  ],
});
```

**Retrieving a Transaction**

In cases where you want to attach Spans to an already ongoing Transaction you can use `Sentry.getCurrentHub().getScope().getTransaction()`. This function will return a `Transaction` in case there is a running Transaction otherwise it returns `undefined`. If you are using our Tracing integration by default we attach the Transaction to the Scope. So you could do something like this:

```javascript
function myJsFunction() {
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  if (transaction) {
    let span = transaction.startChild({
      op: "encode",
      description: "parseAvatarImages"
    });
    // Do something
    span.finish();
  }
}
```

**Adding Query Information and Parameters to Spans**

Currently, every tag has a maximum character limit of 200 characters. Tags over the 200 character limit will become truncated, losing potentially important information. To retain this data, you can split data over several tags instead.

For example, a 200+ character tagged request:

`https://empowerplant.io/api/0/projects/ep/setup_form/?user_id=314159265358979323846264338327&tracking_id=EasyAsABC123OrSimpleAsDoReMi&product_name=PlantToHumanTranslator&product_id=161803398874989484820458683436563811772030917980576`

The 200+ character request above will become truncated to:

`https://empowerplant.io/api/0/projects/ep/setup_form/?user_id=314159265358979323846264338327&tracking_id=EasyAsABC123OrSimpleAsDoReMi&product_name=PlantToHumanTranslator&product_id=1618033988749894848`

Instead, using `span.setTag` splits the details of this request over several tags. This could be done over `baseUrl`, `endpoint`, `parameters`, in this case, resulting in three different tags:

```javascript
const span = transaction.startChild({
  op: "request",
  description: "setup form"
});
span.setTag("baseUrl", baseUrl);
span.setTag("endpoint", endpoint);
span.setTag("parameters", parameters);
http.get(`${base_url}/${endpoint}/`, data=parameters);
```

baseUrl

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

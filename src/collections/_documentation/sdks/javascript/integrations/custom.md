---
title: Custom Integrations
excerpt: ""
---

{%- capture __custom-integration -%}

```js
import * as Sentry from '@sentry/browser';

// All integration that come with an SDK can be found on Sentry.Integrations object
// Custom integration must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/integration.ts

Sentry.init({
  dsn: '___Public_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```

{%- endcapture -%}

{%- include common/integration-custom.md 
sdk_name="JavaScript"

custom-integration=__custom-integration
root_link="javascript"
 -%}

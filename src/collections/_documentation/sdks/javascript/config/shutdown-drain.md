---
title: Shutdown and Draining
excerpt: ""
---

{%- capture __shutdown_drain_content -%}

```js
Sentry.close(2000).then(function() { // perform something after close
});
```

{%- endcapture %}


{%- include common/configuration-shutdown-draining.md 
sdk_name="JavaScript"

shutdown_drain_content=__shutdown_drain_content 
 -%}
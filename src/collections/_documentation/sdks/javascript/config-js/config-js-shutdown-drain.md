---
title: JavaScript
excerpt: ""
---

{%- capture __shutdown_drain_content -%}

```jsx
Sentry.close(2000).then(function() { // perform something after close
});
```

{%- endcapture %}


{%- include common/configuration-shutdown-draining.md 
sdk_name=page.title

shutdown_drain_content=__shutdown_drain_content 
 -%}
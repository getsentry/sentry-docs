---
title: Breadcrumbs
excerpt: ""
---

{%- capture errors_manual_breadcrumbs -%}

```js
// Example for an application that sometimes errors after the screen resizes

window.addEventListener('resize', function(event){
  Sentry.addBreadcrumb({
    category: 'ui',
    message: 'New window size:' + window.innerWidth + 'x' + window.innerHeight,
    level: 'info'
  });
})
```

{%- endcapture -%}

{%- capture errors_modify_breadcrumbs -%}

```js
// Example for an application that sometimes errors after the screen resizes

window.addEventListener('resize', function(event){
  Sentry.addBreadcrumb({
    category: 'ui',
    message: 'New window size:' + window.innerWidth + 'x' + window.innerHeight,
    level: 'info'
  });
})
```

{%- endcapture -%}

{%- include common/errors-breadcrumbs.md 
sdk_name="JavaScript"
errors_manual_breadcrumbs=__errors_manual_breadcrumbs
errors_modify_breadcrumbs=__errors_modify_breadcrumbs
-%}
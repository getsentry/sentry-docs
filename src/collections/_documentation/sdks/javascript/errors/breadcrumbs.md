---
title: Breadcrumbs
excerpt: ""
---

{%- capture __errors_manual_breadcrumbs -%}

This example is for an application that sometimes throws an error after the screen resizes.


```js
// `debounce` function comes from a 3rd party library like Lodash or can be implemented manually
window.addEventListener('resize', debounce(function (event) {
  Sentry.addBreadcrumb({
    category: 'ui',
    message: 'New window size:' + window.innerWidth + 'x' + window.innerHeight,
    level: 'info'
  });
}));

{%- endcapture -%}


{%- include common/errors-breadcrumbs.md 
sdk_name="JavaScript"
errors_manual_breadcrumbs=__errors_manual_breadcrumbs
-%}
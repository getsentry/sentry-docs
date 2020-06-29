---
title: Basic Configuration Options
excerpt: ""
---
{%- capture __config_basic_content -%}
Add the Sentry SDK as a dependency using `yarn` or `npm`:

```jsx
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  maxBreadcrumbs: 50,
  debug: true,
});
```
{%- endcapture -%}

{%- include common/configuration-basics.md 
sdk_name="JavaScript"

config_basic_content=__config_basic_content 
 -%}
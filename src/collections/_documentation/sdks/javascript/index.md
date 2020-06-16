---
title: JavaScript
excerpt: ""
---

{%- capture __install_content -%}
Add the Sentry SDK as a dependency using `yarn` or `npm`:

```bash
# Using yarn
$ yarn add @sentry/browser

# Using npm
$ npm install @sentry/browser
```
{%- endcapture -%}

{%- include common/getting-started.md 
sdk_name=page.title
install_content=__install_content -%}

{%- capture __config_content -%}

```Sentry.init({ dsn: '___PUBLIC_DSN___' });```

{%- endcapture -%}

{%- include common/getting-started.md 
sdk_name=page.title
config_content=__config_content -%}
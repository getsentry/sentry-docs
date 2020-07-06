---
title: Basic Configuration Options
excerpt: ""
---
{%- capture __config_basic_content -%}

```js
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
hide_error_types=true
hide_send_default_pii=true
hide_server_name=true
hide_in_app_include=true
hide_in_app_exclude=true
hide_request_bodies=true
hide_with_locals=true
hide_ca_certs=true
hide_http_proxy=true
hide_https_proxy=true
hide_shutdown_timeout=true
 -%}
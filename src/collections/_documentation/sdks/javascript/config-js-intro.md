---
title: Manage Configuration Options
excerpt: ""
---

{%- capture __config-page_content -%}

- **[Source Maps](/platforms/javascript/sourcemaps)**

    Learn more about the Sentry JavaScript SDK's automatic fetching of source code and source maps by scraping the URLs within the stack trace.

- **[Supported Browsers](/sdks/javascript/config/supported-browsers)**

    We support a variety of browsers; check out our list.

- **[Lazy Loading](/sdks/javascript/config/lazy-load-sentry)**

    We recommend using our bundled CDN version for the browser. However, if you use `defer`, learn more about its effect on capturing errors.

{%- endcapture -%}



{%- include common/configuration-intro.md 
sdk_name="JavaScript"

config-page_content=__config-page_content
root_link="javascript"
 -%}
 
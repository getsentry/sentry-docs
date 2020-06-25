---
title: Configuration Options
excerpt: ""
---

{%- capture __config-page_content -%}

- [Source Maps](_platforms/javascript/sourcemaps.md)]
Learn more about the Sentry JavaScript SDK's automatic fetching of source code and source maps by scraping the URLs within the stack trace

- [Supported Browsers](_sdks/javascript/supported-browsers.md)
We support a variety of browsers; check out our list on this page.

- [Lazy Loading the Sentry SDK](_sdks/javascript/lazy-load-sentry.md)
We recommend using our bundled CDN version for the browser. However, if you use `defer`, learn more about its effect on capturing errors on this page.

{%- endcapture -%}



{%- include common/configuration-intro.md 
sdk_name=page.title

config-page_content=__config-page_content 
 -%}
 
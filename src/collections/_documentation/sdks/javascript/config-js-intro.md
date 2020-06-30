---
title: Configuration Options
excerpt: ""
---

{%- capture __config-page_content -%}

- Source Maps
Learn more about the Sentry JavaScript SDK's automatic fetching of source code and source maps by scraping the URLs within the stack trace
<!-- Note for reviewers - this link is to existing content -->

- Supported Browsers
We support a variety of browsers; check out our list on this page.

- Lazy Loading the Sentry SDK
We recommend using our bundled CDN version for the browser. However, if you use `defer`, learn more about its effect on capturing errors on this page.

- Shutdown and Draining
Learn more about the default behavior of our JavaScript SDK if the application shuts down unexpectedly.

{%- endcapture -%}



{%- include common/configuration-intro.md 
sdk_name=page.title

config-page_content=__config-page_content 
 -%}
 
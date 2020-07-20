---
title: Integrations
excerpt: ""
---

{%- capture __integration_system-content -%}
`InboundFilters`, `FunctionToString`, `Breadcrumbs`, `GlobalHandlers`, `LinkedErrors`, `UserAgent`

{%- endcapture -%}

{%- capture __integration_pluggable-content -%}
`ExtraErrorData`, `CaptureConsole`, `Dedupe`, `Debug`, `RewriteFrames`, `ReportingObserver`


{%- endcapture -%}

{%- capture __integration_framework -%}
## Framework Integrations

These integrations build upon the functions available in the JavaScript SDK. The functions are specific to the framework, and must be installed separately.

- [Angular](/platforms/javascript/angular/)
- [Backbone](/clients/javascript/integrations/)
- [Ember](/platforms/javascript/ember/)
- [Express](/platforms/node/express/)
- [Koa](/platforms/node/koa/)
- [Node.js](/platforms/node/)
- [React](/platforms/javascript/react/)
- [Vue](/platforms/javascript/vue/)

{%- endcapture -%}

{%- include common/integration-intro.md 
sdk_name="JavaScript"

integration_framework=__integration_framework
integration_pluggable-content=__integration_pluggable-content
integration_system-content=__integration_system-content
root_link="javascript"
 -%}
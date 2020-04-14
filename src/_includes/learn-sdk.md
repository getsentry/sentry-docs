{% capture __alert_content -%}
This page will provide you with details that are very specific to the platform, to learn how to use our unified 
SDKs in general, please visit the [Error Reporting]({%- link _documentation/error-reporting/quickstart.md -%}?platform={{ include.platform }}), [Enriching Error Data]({%- link _documentation/enriching-error-data/additional-data.md -%}?platform={{ include.platform }}), [Releases]({%- link _documentation/workflow/releases.md -%}?platform={{ include.platform }}),  and [Data Management]({%- link _documentation/data-management/event-grouping/index.md -%}?platform={{ include.platform }}) sections.
{%- endcapture -%}
{%- include components/alert.html
  title="Learn about SDK usage"
  content=__alert_content
%}

{% capture __alert_content -%}
This page will provide you with details that are very specific to the platform. To learn how to use our unified 
SDKs in general, please visit the [Error Reporting](/error-reporting/quickstart/?platform={{ include.platform }}), [Enriching Error Data](/enriching-error-data/additional-data/?platform={{ include.platform }}), [Releases](/workflow/releases/?platform={{ include.platform }}),  and [Data Management](/data-management/event-grouping/?platform={{ include.platform }}) sections.
{%- endcapture -%}
{%- include components/alert.html
  title="Learn about SDK usage"
  content=__alert_content
%}

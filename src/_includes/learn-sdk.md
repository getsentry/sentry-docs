{% capture __alert_content -%}
This page will provide you with details that are very specific to the platform, to learn how to use our unified 
SDKs in general, please visit the [Learn section]({%- link _documentation/learn/quickstart.md -%}?platform={{ include.platform }})
{%- endcapture -%}
{%- include components/alert.html
  title="Learn about SDK usage"
  content=__alert_content
%}
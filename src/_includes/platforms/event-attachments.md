The organization and project setting _Store Native Crash Reports_ also enables
storage of the original minidump files. For data privacy reasons, this setting
is by default disabled. Raw minidumps are deleted permanently with their issues
or after 30 days.

{% capture __alert_content -%}
Event attachments are not yet available to all organizations. If interested, please [contact](https://sentry.io/contact/enterprise/) our friendly sales team to enroll your organization and receive more information. We are working to bring this feature to all customers in the near future.
{%- endcapture -%}
{%- include components/alert.html
  title="Early Access"
  content=__alert_content
%}
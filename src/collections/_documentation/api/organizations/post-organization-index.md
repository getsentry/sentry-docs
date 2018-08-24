---
title: 'Create a New Organization'
---

POST /api/0/organizations/

: Create a new organization owned by the request’s user. To create an organization only the name is required.

  <table class="table"><tbody valign="top"><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the human readable name for the new organization.</li><li><strong>slug</strong> (<em>string</em>) – the unique URL slug for this organization. If this is not provided a slug is automatically generated based on the name.</li><li><strong>agreeTerms</strong> (<em>bool</em>) – a boolean signaling you agree to the applicable terms of service and privacy policy.</li></ul></td></tr><tr><th>Authentication:</th><td>required, user context needed</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/organizations/</td></tr></tbody></table>

  {% capture __alert_content -%}
  This endpoint needs a user context which is currently not possible through API keys. This endpoint is presently only useful for Sentry itself.
  {%- endcapture -%}
  {%- include components/alert.html
    title="Note"
    content=__alert_content
  %}

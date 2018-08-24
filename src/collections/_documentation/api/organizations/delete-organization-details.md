---
title: 'Delete an Organization'
sidebar_order: 1
---

DELETE /api/0/organizations/_{organization_slug}_/

: Schedules an organization for deletion. This API endpoint cannot be invoked without a user context for security reasons. This means that at present an organization can only be deleted from the Sentry UI.

  Deletion happens asynchronously and therefor is not immediate. However once deletion has begun the state of a project changes and will be hidden from most public views.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the team should be created for.</td></tr><tr><th>Authentication:</th><td>required, user context needed</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/</td></tr></tbody></table>

  {% capture __alert_content -%}
  This endpoint needs a user context which is currently not possible through API keys. This endpoint is presently only useful for Sentry itself.
  {%- endcapture -%}
  {%- include components/alert.html
    title="Note"
    content=__alert_content
  %}

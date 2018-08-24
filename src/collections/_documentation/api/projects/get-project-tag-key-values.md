---
title: 'List a Tag’s Values'
sidebar_order: 8
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/tags/_{key}_/values/

: Return a list of values associated with this key. The _query_ parameter can be used to to perform a “contains” match on values.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project.</li><li><strong>key</strong> (<em>string</em>) – the tag key to look up.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/tags/<em>{key}</em>/values/</td></tr></tbody></table>

---
title: 'Retrieve a Service Hooks'
sidebar_order: 13
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/hooks/_{hook_id}_/

: Return a service hook bound to a project.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the client keys belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the client keys belong to.</li><li><strong>hook_id</strong> (<em>string</em>) – the guid of the service hook.</li></ul></td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/hooks/<em>{hook_id}</em>/</td></tr></tbody></table>

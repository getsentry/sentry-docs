---
title: 'Update a Client Key'
sidebar_order: 16
---

PUT /api/0/projects/_{organization_slug}_/_{project_slug}_/keys/_{key_id}_/

: Update a client key. This can be used to rename a key.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the client keys belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the client keys belong to.</li><li><strong>key_id</strong> (<em>string</em>) – the ID of the key to update.</li></ul></td></tr><tr><th>Parameters:</th><td><strong>name</strong> (<em>string</em>) – the new name for the client key.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/keys/<em>{key_id}</em>/</td></tr></tbody></table>

---
title: 'Retrieve an Organization Release’s File'
sidebar_order: 13
---

GET /api/0/organizations/_{organization_slug}_/releases/_{version}_/files/_{file_id}_/

: Return details on an individual file within a release. This does not actually return the contents of the file, just the associated metadata.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li><li><strong>file_id</strong> (<em>string</em>) – the ID of the file to retrieve.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/files/<em>{file_id}</em>/</td></tr></tbody></table>

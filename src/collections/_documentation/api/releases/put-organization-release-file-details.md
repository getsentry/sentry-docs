---
title: 'Update an Organization Release’s File'
sidebar_order: 17
---

PUT /api/0/organizations/_{organization_slug}_/releases/_{version}_/files/_{file_id}_/

: Update metadata of an existing file. Currently only the name of the file can be changed.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li><li><strong>file_id</strong> (<em>string</em>) – the ID of the file to update.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the new name of the file.</li><li><strong>dist</strong> (<em>string</em>) – the name of the dist.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>PUT</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/files/<em>{file_id}</em>/</td></tr></tbody></table>

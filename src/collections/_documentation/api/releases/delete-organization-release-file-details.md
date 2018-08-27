---
title: 'Delete an Organization Release’s File'
sidebar_order: 3
---

DELETE /api/0/organizations/_{organization_slug}_/releases/_{version}_/files/_{file_id}_/

: Permanently remove a file from a release.

  This will also remove the physical file from storage.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li><li><strong>file_id</strong> (<em>string</em>) – the ID of the file to delete.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/files/<em>{file_id}</em>/</td></tr></tbody></table>

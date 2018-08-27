---
title: 'Delete an Organization’s Release'
sidebar_order: 4
---

DELETE /api/0/organizations/_{organization_slug}_/releases/_{version}_/

: Permanently remove a release and all of its files.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/</td></tr></tbody></table>

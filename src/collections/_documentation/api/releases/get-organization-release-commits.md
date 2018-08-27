---
title: 'List an Organization Release’s Commits'
sidebar_order: 9
---

GET /api/0/organizations/_{organization_slug}_/releases/_{version}_/commits/

: Retrieve a list of commits for a given release.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/commits/</td></tr></tbody></table>

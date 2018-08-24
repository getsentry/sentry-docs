---
title: 'List issues to be resolved in a particular release'
sidebar_order: 11
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/resolved/

: Retrieve a list of issues to be resolved in a given release.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project associated with the release.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/resolved/</td></tr></tbody></table>

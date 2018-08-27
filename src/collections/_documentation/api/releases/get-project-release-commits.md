---
title: 'List a Project Release’s Commits'
sidebar_order: 5
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/commits/

: Retrieve a list of commits for a given release.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to list the release files of.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/commits/</td></tr></tbody></table>

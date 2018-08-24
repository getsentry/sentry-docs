---
title: 'List a Repository’s Commits'
sidebar_order: 2
---

GET /api/0/organizations/_{organization_slug}_/repos/_{repo_id}_/commits/

: Return a list of commits for a given repository.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the organization short name</li><li><strong>repo_id</strong> (<em>string</em>) – the repository ID</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/repos/<em>{repo_id}</em>/commits/</td></tr></tbody></table>

---
title: 'List a Project’s DSym Files'
sidebar_order: 4
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/files/dsyms/

: Retrieve a list of dsym files for a given project.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to list the dsym files of.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/files/dsyms/</td></tr></tbody></table>

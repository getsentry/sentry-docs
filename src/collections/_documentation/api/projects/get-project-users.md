---
title: 'List a Project’s Users'
sidebar_order: 7
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/users/

: Return a list of users seen within this project.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project.</li><li><strong>key</strong> (<em>string</em>) – the tag key to look up.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Query Parameters:</th><td><strong>query</strong> (<em>string</em>) – Limit results to users matching the given query. Prefixes should be used to suggest the field to match on: <code class="docutils literal">id</code>, <code class="docutils literal">email</code>, <code class="docutils literal">username</code>, <code class="docutils literal">ip</code>. For example, <code class="docutils literal">query=email:foo@example.com</code></td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/users/</td></tr></tbody></table>

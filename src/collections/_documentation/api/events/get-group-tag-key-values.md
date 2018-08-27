---
title: 'List a Tag’s Values'
sidebar_order: 4
---

GET /api/0/issues/_{issue_id}_/tags/_{key}_/values/

: Return a list of values associated with this key for an issue.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>issue_id</strong> (<em>string</em>) – the ID of the issue to retrieve.</li><li><strong>key</strong> (<em>string</em>) – the tag key to look the values up for.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/issues/<em>{issue_id}</em>/tags/<em>{key}</em>/values/</td></tr></tbody></table>

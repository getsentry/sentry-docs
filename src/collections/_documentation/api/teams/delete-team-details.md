---
title: 'Delete a Team'
sidebar_order: 2
---

DELETE /api/0/teams/_{organization_slug}_/_{team_slug}_/

: Schedules a team for deletion.

  **Note:** Deletion happens asynchronously and therefor is not immediate. However once deletion has begun the state of a project changes and will be hidden from most public views.

  <table class="table"><tbody valign="top"><tr><th>Method:</th><td>DELETE</td></tr><tr><th>Path:</th><td>/api/0/teams/<em>{organization_slug}</em>/<em>{team_slug}</em>/</td></tr></tbody></table>

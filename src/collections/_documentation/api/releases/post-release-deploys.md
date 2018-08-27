---
title: 'Create a Deploy'
---

POST /api/0/organizations/_{organization_slug}_/releases/_{version}_/deploys/

: Create a deploy for a given release.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the organization short name</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>environment</strong> (<em>string</em>) – the environment you’re deploying to</li><li><strong>name</strong> (<em>string</em>) – the optional name of the deploy</li><li><strong>url</strong> (<em>url</em>) – the optional url that points to the deploy</li><li><strong>dateStarted</strong> (<em>datetime</em>) – an optional date that indicates when the deploy started</li><li><strong>dateFinished</strong> (<em>datetime</em>) – an optional date that indicates when the deploy ended. If not provided, the current time is used.</li></ul></td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/deploys/</td></tr></tbody></table>

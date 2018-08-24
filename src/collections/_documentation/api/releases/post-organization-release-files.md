---
title: 'Upload a New File'
sidebar_order: 19
---

POST /api/0/organizations/_{organization_slug}_/releases/_{version}_/files/

: Upload a new file for the given release.

  Unlike other API requests, files must be uploaded using the traditional multipart/form-data content-type.

  The optional ‘name’ attribute should reflect the absolute path that this file will be referenced as. For example, in the case of JavaScript you might specify the full web URI.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the name (full path) of the file.</li><li><strong>file</strong> (<em>file</em>) – the multipart encoded file.</li><li><strong>dist</strong> (<em>string</em>) – the name of the dist.</li><li><strong>header</strong> (<em>string</em>) – this parameter can be supplied multiple times to attach headers to the file. Each header is a string in the format <code class="docutils literal">key:value</code>. For instance it can be used to define a content type.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/organizations/<em>{organization_slug}</em>/releases/<em>{version}</em>/files/</td></tr></tbody></table>

---
title: 'Upload a New Files'
sidebar_order: 19
---

POST /api/0/projects/_{organization_slug}_/_{project_slug}_/files/dsyms/

: Upload a new dsym file for the given release.

  Unlike other API requests, files must be uploaded using the traditional multipart/form-data content-type.

  The file uploaded is a zip archive of a Apple .dSYM folder which contains the individual debug images. Uploading through this endpoint will create different files for the contained images.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to change the release of.</li></ul></td></tr><tr><th>Parameters:</th><td><strong>file</strong> (<em>file</em>) – the multipart encoded file.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/files/dsyms/</td></tr></tbody></table>

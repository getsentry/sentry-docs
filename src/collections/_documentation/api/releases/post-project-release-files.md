---
title: 'Upload a New File'
sidebar_order: 20
---

POST /api/0/projects/_{organization_slug}_/_{project_slug}_/releases/_{version}_/files/

: Upload a new file for the given release.

  Unlike other API requests, files must be uploaded using the traditional multipart/form-data content-type.

  The optional ‘name’ attribute should reflect the absolute path that this file will be referenced as. For example, in the case of JavaScript you might specify the full web URI.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the release belongs to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project to change the release of.</li><li><strong>version</strong> (<em>string</em>) – the version identifier of the release.</li></ul></td></tr><tr><th>Parameters:</th><td><ul><li><strong>name</strong> (<em>string</em>) – the name (full path) of the file.</li><li><strong>dist</strong> (<em>string</em>) – the name of the dist.</li><li><strong>file</strong> (<em>file</em>) – the multipart encoded file.</li><li><strong>header</strong> (<em>string</em>) – this parameter can be supplied multiple times to attach headers to the file. Each header is a string in the format <code class="docutils literal">key:value</code>. For instance it can be used to define a content type.</li></ul></td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>POST</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/releases/<em>{version}</em>/files/</td></tr></tbody></table>

## Example

```http
POST /api/0/projects/the-interstellar-jurisdiction/pump-station/releases/e48e7b5b90327ea1a4d1a4360c735eee7b536f82/files/ HTTP/1.1
Authorization: Basic {base64-encoded-key-here}
Host: app.getsentry.com
Content-Type: multipart/form-data; boundary=cde088f87d2f441ea66ea3ab74245f2b

--cde088f87d2f441ea66ea3ab74245f2b
Content-Disposition: form-data; name="header"

Content-Type:text/plain; encoding=utf-8
--cde088f87d2f441ea66ea3ab74245f2b
Content-Disposition: form-data; name="name"

/demo/hello.py
--cde088f87d2f441ea66ea3ab74245f2b
Content-Disposition: form-data; name="file"; filename="hello.py"

print "Hello World!"
--cde088f87d2f441ea66ea3ab74245f2b--
```

```http
HTTP/1.1 201 CREATED
Allow: GET, POST, HEAD, OPTIONS
Content-Language: en
Content-Length: 217
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "sha1": "7dc0876d778eae1093028f7bf368d0b95a53ec1a",
  "dist": null,
  "name": "/demo/hello.py",
  "dateCreated": "2018-08-22T18:24:15.908Z",
  "headers": {
    "Content-Type": "text/plain; encoding=utf-8"
  },
  "id": "4",
  "size": 20
}
```

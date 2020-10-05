---
name: Minidump
doc_link: https://docs.sentry.io/platforms/native/minidump/
support_level: production
type: framework
---

## Creating and Uploading Minidumps {#minidump-integration}

Depending on your operating system and programming language, there are various
alternatives to create minidumps and upload them to Sentry. See the following
resources for libraries that support generating minidump crash reports:

- [Native SDK](/platforms/native/)
- [Google Breakpad](/platforms/native/breakpad/)
- [Google Crashpad](/platforms/native/crashpad/)

If you have already integrated a library that generates minidumps and would just
like to upload them to Sentry, you need to configure the _Minidump Endpoint
URL_, which can be found at _Project Settings > Client Keys (DSN)_. This
endpoint expects a `POST` request with the minidump in the
`upload_file_minidump` field:

```bash
curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp
```

To send additional information, add more form fields to this request. For a full
description of fields accepted by Sentry, see [Passing Additional
Data](/platforms/native/minidump/).

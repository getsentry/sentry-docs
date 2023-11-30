---
name: Minidump
doc_link: https://docs.sentry.io/platforms/native/minidump/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

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

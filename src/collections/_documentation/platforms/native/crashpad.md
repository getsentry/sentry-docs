---
title: 'Google Crashpad'
sidebar_order: 1
---

[Crashpad](https://chromium.googlesource.com/crashpad/crashpad/+/master/README.md)
is an open-source multiplatform crash reporting system written in C++ by Google.
It supports macOS, Windows and Linux (limited), and features an uploader to
submit minidumps to a configured URL right when the process crashes.

{% capture __alert_content -%}
Sentry offers a higher-level [Native SDK]({%- link
_documentation/platforms/native/index.md -%}) that has an integration with
Crashpad. If you're setting up Crashpad for the first time, you might save some
time this way!
{%- endcapture -%}
{%- include components/alert.html
  title="Heads Up"
  content=__alert_content
  level="info"
%}

Follow the [Crashpad developer docs](https://chromium.googlesource.com/crashpad/crashpad/+/HEAD/doc/developing.md) for instructions on how to build Crashpad from source. Make sure that crashpad’s header files are in your include path, then add a call to [StartHandler()](https://crashpad.chromium.org/doxygen/classcrashpad_1_1CrashpadClient.html#a810ad9941bedba543bf60507c31c55da) during your program startup:

```cpp
#include <map>
#include <string>
#include <vector>

#include "client/crashpad_client.h"
#include "client/settings.h"

using namespace crashpad;

bool startCrashpad() {
  // Cache directory that will store crashpad information and minidumps
  base::FilePath database("path/to/crashpad/db");
  // Path to the out-of-process handler executable
  base::FilePath handler("path/to/crashpad_handler");
  // URL used to submit minidumps to
  std::string url("___MINIDUMP_URL___");
  // Optional annotations passed via --annotations to the handler
  std::map<string, string> annotations;
  // Optional arguments to pass to the handler
  std::vector<string> arguments;

  CrashpadClient client;
  bool success = client.StartHandler(
    handler,
    database,
    database,
    url,
    annotations,
    arguments,
    /* restartable */ true,
    /* asynchronous_start */ false
  );

  return success;
}
```

This method directs crashes to the Crashpad handler. On macOS, this is applicable to this process and all subsequent child processes. On other platforms, child processes must also register by using [SetHandlerIPCPipe()](https://crashpad.chromium.org/doxygen/classcrashpad_1_1CrashpadClient.html#a9f1d5d38e9b4f5781e3821551dcc39d5). For more information on configuring the crashpad handler, see [crashpad_handler](https://chromium.googlesource.com/crashpad/crashpad/+/HEAD/handler/crashpad_handler.md).

If you also want Crashpad to upload crashes to Sentry, additionally configure the Crashpad database for automatic uploads:

```cpp
// #include "client/crash_report_database.h"

base::FilePath database("path/to/crashpad/db");
std::unique_ptr<CrashReportDatabase> db =
    crashpad::CrashReportDatabase::Initialize(database);

if (db != nullptr && db->GetSettings() != nullptr) {
  db->GetSettings()->SetUploadsEnabled(true);
}
```

By default, the crashpad handler will limit uploads to one per hour. To disable this limitation, pass the `--no-rate-limit` argument to the handler:

```cpp
arguments.push_back("--no-rate-limit");
```

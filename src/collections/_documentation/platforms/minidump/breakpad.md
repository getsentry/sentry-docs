---
title: 'Google Breakpad'
---

[Breakpad](https://chromium.googlesource.com/breakpad/breakpad/) is an open-source multiplatform crash reporting system written in C++ by Google and the predecessor of Crashpad. It supports macOS, Windows and Linux, and features an uploader to submit minidumps to a configured URL right when the process crashes.

As opposed to Crashpad, Breakpad uses in-process crash reporting. This is less robust and has several disadvantages over out-of-process crash reporting. Unless you have integrated Breakpad already, we strongly recommend you to consider using Crashpad instead.

## Integration

Build and integration depend on the target platform. Please refer to [Breakpad Integration Overview](https://chromium.googlesource.com/breakpad/breakpad/+/master/docs/getting_started_with_breakpad.md#integration-overview) for official instructions on how to integrate with your program. Generally, you will need to add the Breakpad headers to the include path and then start a platform dependent `ExceptionHandler`.

For official platform documentation, visit:

-   [Linux Starter Guide](https://chromium.googlesource.com/breakpad/breakpad/+/master/docs/linux_starter_guide.md)
-   [Mac Starter Guide](https://chromium.googlesource.com/breakpad/breakpad/+/master/docs/mac_breakpad_starter_guide.md)
-   [Windows Starter Guide](https://chromium.googlesource.com/breakpad/breakpad/+/master/docs/windows_client_integration.md)

## Linux Example

First, initialize the `ExceptionHandler` and pass it a callback that is invoked when a minidump is generated. This can be used to move it to a known location or register it for uploading:

```cpp
#include "client/linux/handler/exception_handler.h"

using namespace google_breakpad;

namespace {

bool callback(const MinidumpDescriptor &descriptor,
              void *context,
              bool succeeded) {
    // if succeeded is true, descriptor.path() contains a path
    // to the minidump file. Context is the context passed to
    // the exception handler's constructor.
    return succeeded;
}

}

int main(int argc, char *argv[]) {
    MinidumpDescriptor descriptor("path/to/cache");
    ExceptionHandler eh(
      descriptor,
      /* filter */ nullptr,
      callback,
      /* context */ nullptr,
      /* install handler */ true,
      /* server FD */ -1
    );

    // run your program here
    return 0;
}
```

Next, implement a minidump upload to Sentry. Since the exception handler callback should perform as little action as possible, this upload is ideally started at the next application start. You can use the `HttpUpload` class, which is provided as part of the Breakpad client:

```cpp
#include <string>
#include "common/linux/http_upload.h"

bool UploadMinidump(std::string &path) {
  // Add additional arguments for Sentry
  std::map<string, string> parameters;

  std::map<string, string> files;
  files["upload_file_minidump"] = path;

  return HTTPUpload::SendRequest(
    "___MINIDUMP_URL___",
    parameters,
    files,
    /* proxy */ "",
    /* proxy password */ "",
    /* certificate */ "",
    /* response body */ nullptr,
    /* response code */ nullptr,
    /* error */ nullptr
  );
}
```

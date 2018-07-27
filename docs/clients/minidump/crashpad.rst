Google Crashpad
===============

`Crashpad`_ is an open-source multiplatform crash reporting system written in
C++ by Google. It supports macOS, Windows and Linux (limited), and features an
uploader to submit minidumps to a configured URL right when the process crashes.

Follow the `Crashpad developer docs <Developing Crashpad_>`_ for instructions on
how to build Crashpad from source. Make sure that crashpad's header files are in
your include path, then add a call to `StartHandler()`_ during your program
startup:

.. code-block:: cpp

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

      if (success) {
        success = client.WaitForHandlerStart(INFINITE);
      }

      return success;
    }

This method directs crashes to the Crashpad handler. On macOS, this is
applicable to this process and all subsequent child processes. On other
platforms, child processes must also register by using `SetHandlerIPCPipe()`_.
For more information on configuring the crashpad handler, see
`crashpad_handler`_.

.. admonition:: Known Issue

    Sentry cannot handle gzip compressed minidump submissions and will respond
    with a 400 error. To fix this, pass the ``--no-upload-gzip`` argument to the
    handler:

    .. code-block:: cpp

        arguments.push_back("--no-upload-gzip");

If you also want Crashpad to upload crashes to Sentry, additionally configure
the Crashpad database for automatic uploads:

.. code-block:: cpp

    // #include "client/crash_report_database.h"

    base::FilePath database("path/to/crashpad/db");
    std::unique_ptr<CrashReportDatabase> db =
        crashpad::CrashReportDatabase::Initialize(database);

    if (db != nullptr && db->GetSettings() != nullptr) {
      db->GetSettings()->SetUploadsEnabled(true);
    }

By default, the crashpad handler will limit uploads to one per hour. To disable
this limitation, pass the ``--no-rate-limit`` argument to the handler:

.. code-block:: cpp

    arguments.push_back("--no-rate-limit");

.. _Crashpad: https://chromium.googlesource.com/crashpad/crashpad/+/master/README.md
.. _Developing Crashpad: https://chromium.googlesource.com/crashpad/crashpad/+/HEAD/doc/developing.md
.. _StartHandler(): https://crashpad.chromium.org/doxygen/classcrashpad_1_1CrashpadClient.html#a810ad9941bedba543bf60507c31c55da
.. _SetHandlerIPCPipe(): https://crashpad.chromium.org/doxygen/classcrashpad_1_1CrashpadClient.html#a9f1d5d38e9b4f5781e3821551dcc39d5
.. _crashpad_handler: https://chromium.googlesource.com/crashpad/crashpad/+/HEAD/handler/crashpad_handler.md

To allow Sentry to fully process native crashes and provide you with symbolicated stack traces, you need to upload _Debug Information Files_ (sometimes also referred to as _Debug Symbols_ or just _Symbols_). We recommend to upload debug information during your build or release process.

Note that you need to provide debug information for all libraries that you would like to receive symbolication for. This includes dependencies and operating system libraries. If you are not sure which files are required, go to _Project Settings > Processing Issues_, which shows a list of all required files and instructions to retrieve them.

In addition to Debug Information Files, Sentry needs _Call Frame Information_
(CFI) to extract accurate stack traces from minidumps of optimized release
builds. CFI is usually part of the executables and not copied to debug symbols.
Unless you are uploading Breakpad symbols, be sure to also include the binaries
when uploading files to Sentry.

For more information on uploading debug information and their supported formats, see [Debug Information Files]({%- link _documentation/cli/dif/index.md -%}#sentry-cli-dif).
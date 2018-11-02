---
title: 'Debug Information Files'
sidebar_order: 3
---

`sentry-cli` can be used to validate and upload debug information files (dSYM, Proguard files, etc.).

Debug information files are additional files that help us provide better information about your crash reports. We currently support the following formats:

-   [_dSYM files_]({%- link _documentation/cli/dif/dsym.md -%}) for iOS, tvOS and macOS
-   [_ELF symbols_]({%- link _documentation/cli/dif/elf.md -%}) for Linux and Android
-   [_PDB files_]({%- link _documentation/cli/dif/pdb.md -%}) for Windows
-   [_Breakpad symbols_]({%- link _documentation/cli/dif/breakpad.md -%}) for Breakpad or Crashpad
-   [_Proguard mappings_]({%- link _documentation/cli/dif/proguard.md -%}) for Android

Note that sourcemaps, while also being debug information files, are handled differently in Sentry. For more information see [Sourcemaps in sentry-cli]({%- link _documentation/cli/releases.md -%}#sentry-cli-sourcemaps).

## File Assocations

Generally, Sentry associates debug information files with events through their unique ID. Each debug information file has at least one unique ID. As a special case, dSYM files can contain symbols for more than one ID. If you have a debug information file you can use the `sentry-cli difutil check` command to print the contained IDs. The ID depends on the file type: dSYMs and proguard files use UUIDs, Linux symbols use longer hash values (e.g. SHA256) and PDBs use UUIDs and an age field.

Likewise, the upload commands (e.g. `sentry-cli upload-dif`) allow to search for specific debug information files by providing their known identifiers.

## Checking Files

Not all debug information files can be used by Sentry. To see if they are usable or not you can use the `sentry-cli difutil check` command:

```bash
$ sentry-cli difutil check /path/to/debug/information/file
```

This will report the UUIDs of the debug information file as well as if it passes basic requirements for Sentry.

## Finding Files

If you see in Sentry’s UI that debug information files are missing but you are not sure how to locate them, you can use the `sentry-cli difutil find` command to look for them:

```bash
$ sentry-cli difutil find <identifier>
```

Additionally, `sentry-cli upload-dif` can automatically search for files in a folder or ZIP archive.

## Uploading Files

Options for the debug file upload depend on the upload environment and debug format. For detailed instructions, please refer to the resources linked below:

-   [_dSYM Upload_]({%- link _documentation/cli/dif/dsym.md -%})
-   [_ELF Symbol Upload_]({%- link _documentation/cli/dif/elf.md -%})
-   [_PDB Upload_]({%- link _documentation/cli/dif/pdb.md -%})
-   [_Breakpad Symbol Upload_]({%- link _documentation/cli/dif/breakpad.md -%})
-   [_Proguard Mapping Upload_]({%- link _documentation/cli/dif/proguard.md -%})

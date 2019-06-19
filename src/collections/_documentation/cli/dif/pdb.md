---
title: 'PDB Upload'
sidebar_order: 2
---

`sentry-cli` can upload PDB files, as well as Windows executables and DLLs. PDBs
are the debug information container used by Microsoft for the Windows platform.
Note that at the moment Sentry will upload Native PDBs, but not .NET Portable
PDBs.

In addition to PDBs, always consider uploading the actual executables and
libraries. The `sentry-cli` will determine during the upload process whether
those files contain useful debug information. This is especially important for
_64-bit_ systems, where unwind information is not stored in the PDB.

## Basic Upload

Use `upload-dif` to upload PDBs and specify the `pdb` and `pe` types. The
command will recursively scan the provided folders or ZIP archives. Depending on
whether the executables contain debug information usable by Sentry, they may be
selected for upload in addition to the PDBs. On 32-bit Intel platforms, expect
that executables are omitted. On 64-bit Intel and other architectures, they are
usually uploaded.

{% capture __alert_content -%}
Because debug files belong to projects, you will need to specify the organization and project you are working with. For more information about this refer to [Working with Projects]({%- link _documentation/cli/configuration.md -%}#sentry-cli-working-with-projects).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Example:

```bash
 $ sentry-cli upload-dif -t pdb -t pe .
> Found 2 debug information files
> Prepared debug information files for upload
> Uploaded 2 missing debug information files
> File processing complete:

     OK 3003763b-afcb-4a97-aae3-28de8f188d7c-1 (crash.exe; x86_64 executable)
     OK 3003763b-afcb-4a97-aae3-28de8f188d7c-1 (crash.pdb; x86_64 debug companion)
```

## Upload Options

There are a few options you can supply for the upload process:

`--no-unwind`

: Do not scan for stack unwinding information. Specify this flag for builds with
  disabled FPO, or when stack walking occurs on the device. This usually
  excludes executables and libraries for 64-bit builds.

`--no-debug`

: Do not scan for debug information. This will usually exclude PDBs. They might
  still be uploaded, if they contain stack unwinding information, usually for
  32-bit builds.

`--no-zips`

: By default, the `sentry-cli` will open and search ZIP archives for files. Use
  this switch to disable if your search paths contain large ZIP archives without
  debug information files to speed up the search.

`--no-reprocessing`

: This parameter prevents Sentry from triggering reprocessing right away. It can
  be useful under rare circumstances where you want to upload files in multiple
  batches, and you want to ensure that Sentry does not start reprocessing before
  some optional dSYMs are uploaded. Note though, that someone can still in the
  meantime trigger reprocessing from the UI.

#!/bin/bash

# This script is used to skip the build on Vercel process based on the changes in the repository.
# It depends on the `NEXT_PUBLIC_DEVELOPER_DOCS` environment variable to determine which app to check for changes.
# basically an exit code of 0 means the build will be skipped, and 1 means it will be built.
# read more here:
# - https://vercel.com/docs/projects/overview#ignored-build-step
# - https://vercel.com/guides/how-do-i-use-the-ignored-build-step-field-on-vercel

# diff status for develop-docs content
dev_docs_diff_status=$(git diff HEAD^ HEAD --quiet -- develop-docs; echo $?)

if [[ "$NEXT_PUBLIC_DEVELOPER_DOCS" == "1" ]] ; then
  exit $dev_docs_diff_status
else
  # exit with the inverse of the diff status.
  if [[ $dev_docs_diff_status -eq 0 ]] ; then
    exit 1
  else
    exit 0
  fi
fi

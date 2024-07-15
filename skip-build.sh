#!/bin/bash

# This script is used to skip the build on Vercel process based on the changes in the repository.
# It depends on the `NEXT_PUBLIC_DEVELOPER_DOCS` environment variable to determine which app to check for changes.
# basically an exit code of 0 means the build will be skipped, and 1 means it will be built.
# read more here:
# - https://vercel.com/docs/projects/overview#ignored-build-step
# - https://vercel.com/guides/how-do-i-use-the-ignored-build-step-field-on-vercel

dev_docs_diff_status=$(git diff HEAD^ HEAD --quiet -- develop-docs; echo $?)
docs_diff_status=$(git diff HEAD^ HEAD --quiet -- docs includes platform-includes ; echo $?)
app_diff_status=$(git diff HEAD^ HEAD --quiet -- src app public ; echo $?)

# always build on changes in non-content related directories
if [[ $app_diff_status -eq 1 ]] ; then
  exit 1
fi

if [[ "$NEXT_PUBLIC_DEVELOPER_DOCS" == "1" ]] ; then
  exit $dev_docs_diff_status
else
  exit $docs_diff_status
fi

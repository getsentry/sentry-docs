#!/bin/bash

# This script is used to skip the build on Vercel process based on the changes in the repository.
# It depends on the `NEXT_PUBLIC_DEVELOPER_DOCS` environment variable to determine which app to check for changes.
# basically an exit code of 0 means the build will be skipped, and 1 means it will be built.
# read more here:
# - https://vercel.com/docs/projects/overview#ignored-build-step
# - https://vercel.com/guides/how-do-i-use-the-ignored-build-step-field-on-vercel

# diff status for develop-docs + docs content
dev_docs_diff_status=$(git diff HEAD^ HEAD --quiet -- develop-docs; echo $?)
docs_diff_status=$(git diff HEAD^ HEAD --quiet -- docs includes platform-includes ; echo $?)

# have changes occurred outside of the content directories
non_content_diff_status=$(git diff HEAD^ HEAD --name-only | grep -vE '^(docs/|platform-includes/|includes/|develop-docs/|apps/)' | wc -l)

# apps/changelog changes or workspace deps changes (yarn.lock)
changelog_diff_status=$(git diff HEAD^ HEAD --name-only | grep -E '^(apps/changelog/|yarn.lock)' | wc -l)

if [[ "$NEXT_PUBLIC_CHANGELOG" == "1" ]] ; then
  if [[ $changelog_diff_status -gt 0 ]] ; then
    exit 1
  else
    exit 0
  fi
fi

# always build on changes in non-content related directories
if [[ $non_content_diff_status -gt 0 ]] ; then
  exit 1
fi

if [[ "$NEXT_PUBLIC_DEVELOPER_DOCS" == "1" ]] ; then
  exit $dev_docs_diff_status
else
  exit $docs_diff_status
fi

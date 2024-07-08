#!/bin/bash

# This script is used to skip the build on Vercel process based on the changes in the repository.
# It depends on the APP_NAME environment variable to determine which app to check for changes.
# basically an exit code of 0 means the build will be skipped, and 1 means it will be built.
# read more here:
# - https://vercel.com/docs/projects/overview#ignored-build-step
# - https://vercel.com/guides/how-do-i-use-the-ignored-build-step-field-on-vercel

if [[ "$APP_NAME" == "develop-docs" ]] ; then
  # only build develop-docs if changes are in src/components or develop-docs
  git diff HEAD^ HEAD --quiet -- develop-docs src/components
elif [[ "$APP_NAME" == "sdk-docs" ]]; then
  # only build sdk-docs if changes are in src/components or sdk-docs
 git diff HEAD^ HEAD --quiet -- src/components docs includes platform-includes
fi

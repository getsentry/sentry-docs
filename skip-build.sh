#!/bin/bash

if [[ "$APP_NAME" == "develop-docs" ]] ; then
  # only build develop-docs if changes are in src/components or develop-docs
  git diff HEAD^ HEAD --quiet -- develop-docs src/components
elif [[ "$APP_NAME" == "sdk-docs" ]]; then
  # only build sdk-docs if changes are in src/components or sdk-docs
 git diff HEAD^ HEAD --quiet -- src/components docs includes platform-includes
fi

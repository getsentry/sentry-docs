#!/bin/bash

# Loop through each directory in docs/platforms
for dir in docs/platforms/*/; do
    if [ -d "$dir" ]; then
        # Get the directory name without the path
        dirname=$(basename "$dir")
        
        # Skip if it's already a sentry or sentry-prevent directory
        if [ "$dirname" = "sentry" ] || [ "$dirname" = "sentry-prevent" ]; then
            continue
        fi
        
        echo "Processing $dirname..."
        
        # Create sentry and sentry-prevent directories
        mkdir -p "${dir}sentry"
        mkdir -p "${dir}sentry-prevent"
        
        # Move all contents to sentry directory, excluding the new directories
        find "${dir}" -maxdepth 1 -mindepth 1 -not -name "sentry" -not -name "sentry-prevent" -exec mv {} "${dir}sentry/" \;
        
        # Create index.mdx in sentry-prevent
        mkdir -p "${dir}sentry-prevent"
        cat > "${dir}sentry-prevent/index.mdx" << EOL
---
title: Sentry Prevent
description: "Sentry Prevent documentation for $dirname"
---

# Sentry Prevent for $dirname

Documentation for Sentry Prevent features in $dirname.
EOL

        # Update slug in all MDX files
        find "${dir}sentry" -type f -name "*.mdx" -exec sed -i '' -e 's/^slug: "platforms\//slug: "platforms\/$dirname\/sentry\//g' {} \;
    fi
done 
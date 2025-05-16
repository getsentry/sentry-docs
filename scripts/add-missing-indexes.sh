#!/bin/bash

# For each directory under docs/platforms/*/sentry (recursively)
find docs/platforms/*/sentry -type d | while read dir; do
    # Skip if index.mdx already exists
    if [ -f "$dir/index.mdx" ]; then
        continue
    fi
    # Compute the slug from the path
    slug=$(echo "$dir" | sed 's/^docs\///' | sed 's/\/$//')
    echo "Creating $dir/index.mdx with slug: $slug"
    cat > "$dir/index.mdx" << EOL
---
title: $(basename "$dir")
description: "Auto-generated index for $slug"
slug: "$slug"
---

# $(basename "$dir")

_Auto-generated index file for $slug._
EOL
done 
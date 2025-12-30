#!/bin/bash
# Wrapper script for lychee that warns but doesn't block commits
# Used by pre-commit hook

if ! command -v lychee &> /dev/null; then
    echo "Warning: lychee not installed. Skipping external link check."
    echo "Install with: brew install lychee"
    exit 0
fi

# Run lychee on the provided files
lychee --config .lychee.toml --no-progress "$@"
exit_code=$?

if [ $exit_code -ne 0 ]; then
    echo ""
    echo "⚠️  External link issues found (commit not blocked)"
    echo "   Run 'lychee --config .lychee.toml <file>' for details"
fi

# Always exit 0 so commit proceeds
exit 0

# Dynamic Sentry Wizard Version Implementation

## Current State
The Flutter and Android documentation now includes comprehensive installation options for sentry-wizard, but the version is currently hardcoded to v5.1.0 (updated from the previous v4.0.1).

## Problem Solved
- ✅ Added comprehensive platform support (Windows, macOS Intel/ARM, Linux x64/ARM)
- ✅ Updated to latest version (v5.1.0 from v4.0.1)
- ✅ Windows users no longer forced to use `brew` 
- ✅ Flutter developers can avoid JavaScript tooling (`npx`) if preferred
- ✅ Consistent with Android documentation approach

## Future Enhancement: Dynamic Version Fetching

### Approach 1: Build-time Version Fetching (Recommended)
Create a build script that fetches the latest version during the build process:

```javascript
// scripts/fetch-sentry-wizard-version.js
const fs = require('fs');
const path = require('path');

async function fetchLatestVersion() {
  try {
    const response = await fetch('https://api.github.com/repos/getsentry/sentry-wizard/releases/latest');
    const data = await response.json();
    const version = data.tag_name.startsWith('v') ? data.tag_name : `v${data.tag_name}`;
    
    // Save to a JSON file that can be imported
    const versionData = { sentryWizardVersion: version };
    fs.writeFileSync(
      path.join(__dirname, '../src/data/versions.json'), 
      JSON.stringify(versionData, null, 2)
    );
    
    console.log(`Fetched sentry-wizard version: ${version}`);
  } catch (error) {
    console.warn('Failed to fetch latest version, keeping existing version');
  }
}

fetchLatestVersion();
```

### Approach 2: Runtime Component
Create a React component that fetches the version dynamically:

```typescript
// src/components/SentryWizardInstall.tsx
import { useEffect, useState } from 'react';

export function SentryWizardInstall({ platform }: { platform: string }) {
  const [version, setVersion] = useState('v5.1.0'); // fallback

  useEffect(() => {
    fetch('/api/sentry-wizard-version')
      .then(res => res.json())
      .then(data => setVersion(data.version))
      .catch(() => console.warn('Failed to fetch version'));
  }, []);

  // Render installation commands with dynamic version
  return (
    // ... code blocks with ${version} interpolation
  );
}
```

### Approach 3: MDX Variable Replacement
Use MDX processing to replace version placeholders:

```javascript
// In MDX processing pipeline
const sentryWizardVersion = await fetchLatestVersion();
const processedContent = content.replace(
  /\{\{SENTRY_WIZARD_VERSION\}\}/g, 
  sentryWizardVersion
);
```

### Integration Points
1. **Build process**: Add version fetching to the build pipeline
2. **CI/CD**: Cache GitHub API responses to avoid rate limits
3. **Fallback**: Always have a recent known version as fallback
4. **Consistency**: Apply to all platforms (Flutter, Android, React Native, etc.)

### Implementation Priority
1. **Phase 1**: ✅ Update hardcoded versions to latest (COMPLETED)
2. **Phase 2**: Implement build-time version fetching
3. **Phase 3**: Add runtime version checking for validation
4. **Phase 4**: Automate version updates across all platforms

## Files Updated
- `docs/platforms/dart/guides/flutter/index.mdx` - Updated to v5.1.0
- `docs/platforms/android/index.mdx` - Updated to v5.1.0

## Benefits Achieved
- **Better Windows support**: No more forcing Windows users to use `brew`
- **Ecosystem alignment**: Flutter developers can avoid JavaScript tooling
- **Platform consistency**: All major OS/architecture combinations supported
- **Up-to-date tooling**: Using latest version instead of outdated v4.0.1
- **Maintainability**: When dynamic fetching is implemented, versions will stay current automatically
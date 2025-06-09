# Logs Beta Checkbox Implementation

This document summarizes the implementation of a "Logs Beta" checkbox feature for Sentry SDK setup configurations, similar to the existing user feedback integration checkbox.

## Overview

Added a "Logs Beta" option to the platform setup configuration checkboxes that, when enabled, shows the appropriate logs setup code for each SDK. This was implemented by:

1. Adding the new option to the onboarding component
2. Creating/updating logs setup configuration for each platform
3. Updating platform documentation files to include the logs-beta option

## Changes Made

### 1. Core Component Updates

#### `src/components/onboarding/index.tsx`
- Added `'logs-beta'` to the `OPTION_IDS` array
- Added logs-beta option details to `optionDetails` object with description:
  > "Send structured logs from your application to Sentry to view, search, and analyze alongside your errors and performance data."

### 2. Platform Setup Files

#### `platform-includes/logs/setup/go.mdx` (NEW FILE)
- Created Go logs setup with `EnableLogs: true` configuration

### 3. Platform Documentation Updates

#### Android (`docs/platforms/android/index.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added Android manifest configuration:
  ```xml
  <!-- ___PRODUCT_OPTION_START___ logs-beta -->
  <!-- Enable logs to be sent to Sentry -->
  <meta-data android:name="io.sentry.logs.enabled" android:value="true" />
  <!-- ___PRODUCT_OPTION_END___ logs-beta -->
  ```

#### Flutter (`docs/platforms/dart/guides/flutter/index.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added Flutter configuration:
  ```dart
  // ___PRODUCT_OPTION_START___ logs-beta
  // Enable logs to be sent to Sentry
  options.enableLogs = true;
  // ___PRODUCT_OPTION_END___ logs-beta
  ```

#### PHP (`docs/platforms/php/index.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added PHP configuration:
  ```php
  // ___PRODUCT_OPTION_START___ logs-beta
  // Enable logs to be sent to Sentry
  'enable_logs' => true,
  // ___PRODUCT_OPTION_END___ logs-beta
  ```

#### Python (`docs/platforms/python/index.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added Python configuration:
  ```python
  # ___PRODUCT_OPTION_START___ logs-beta
  # Enable logs to be sent to Sentry
  _experiments={
      "enable_logs": True,
  },
  # ___PRODUCT_OPTION_END___ logs-beta
  ```

#### Ruby (`docs/platforms/ruby/common/index.mdx` and `platform-includes/getting-started-config/ruby.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added Ruby configuration:
  ```ruby
  # ___PRODUCT_OPTION_START___ logs-beta
  # enable logs
  config.enable_logs = true
  # ___PRODUCT_OPTION_END___ logs-beta
  ```

#### Go (`docs/platforms/go/guides/gin/index.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added Go configuration:
  ```go
  // ___PRODUCT_OPTION_START___ logs-beta
  // Enable logs to be sent to Sentry
  EnableLogs: true,
  // ___PRODUCT_OPTION_END___ logs-beta
  ```

#### Java (`platform-includes/getting-started-config/java.mdx`)
- Added Java configuration for both Java and Kotlin:
  ```java
  // ___PRODUCT_OPTION_START___ logs-beta
  // Enable logs to be sent to Sentry
  options.getLogs().setEnabled(true);
  // ___PRODUCT_OPTION_END___ logs-beta
  ```
  ```kotlin
  // ___PRODUCT_OPTION_START___ logs-beta
  // Enable logs to be sent to Sentry
  options.logs.enabled = true
  // ___PRODUCT_OPTION_END___ logs-beta
  ```

#### JavaScript (`docs/platforms/javascript/guides/react/index.mdx` and `platform-includes/getting-started-config/javascript.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options
- Added JavaScript configuration:
  ```javascript
  // ___PRODUCT_OPTION_START___ logs-beta
  // Enable logs to be sent to Sentry
  _experiments: { enableLogs: true },
  // ___PRODUCT_OPTION_END___ logs-beta
  ```

#### Next.js (`docs/platforms/javascript/guides/nextjs/manual-setup.mdx`)
- Added `'logs-beta'` to OnboardingOptionButtons options

## Implementation Details

### SDK-Specific Configuration Methods

Each SDK uses its own method to enable logs:

- **Java/Android**: `options.getLogs().setEnabled(true)` or `options.logs.enabled = true`
- **JavaScript**: `_experiments: { enableLogs: true }`
- **Python**: `_experiments={"enable_logs": True}`
- **Ruby**: `config.enable_logs = true`
- **PHP**: `'enable_logs' => true`
- **Go**: `EnableLogs: true`
- **Flutter**: `options.enableLogs = true`

### Product Option Markers

All configurations use the standard product option markers:
```
// ___PRODUCT_OPTION_START___ logs-beta
[configuration code]
// ___PRODUCT_OPTION_END___ logs-beta
```

These markers are automatically processed by the onboarding component to show/hide the configuration based on checkbox selection.

## Coverage

The implementation covers all requested SDKs:
- ✅ Java
- ✅ Android  
- ✅ Flutter
- ✅ PHP
- ✅ Python
- ✅ Ruby
- ✅ Go
- ✅ JavaScript (React, Next.js, and common config)

## Testing

Users can now:
1. Visit any supported platform documentation page
2. See the "Logs Beta" checkbox in the feature selection
3. Check the box to see logs setup configuration appear
4. Copy the configuration to enable logs in their application

The implementation follows the same pattern as existing features like user feedback, ensuring consistency across the documentation.
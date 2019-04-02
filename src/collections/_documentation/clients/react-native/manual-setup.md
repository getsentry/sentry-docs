---
title: 'Manual Setup'
---

If you can’t (or don’t want) to run the linking step you can see here what is happening on each platform.

## General

You will want to make sure you have already created a `sentry.properties` file at the root of your react native project.  An example of this properties file can be found in the [examples GitHub](https://github.com/getsentry/examples/blob/master/react-native/sentry.properties).

## iOS

### Linking the Native Library

You must link the native Sentry project with your project.  This can be done by following the [Linking Libraries](https://facebook.github.io/react-native/docs/linking-libraries-ios.html) steps described in React Native documentation.

The library you need to link is `node_modules/react-native-sentry/ios/RNSentry.xcodeproj`.

### AppDelegate

Update your `AppDelegate.m` file to pull in the proper native library and initialize it.

```objc
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif

/* in your didFinishLaunchingWithOptions */
[RNSentry installWithRootView:rootView];
```

### Build Steps

When you use Xcode you can hook directly into the build process to upload debug symbols. When linking one build phase script is changed and two more are added.

#### Bundle React Native code and images

We modify the react-native build phase (“Bundle React Native code and images”) slightly from this:

```bash
export NODE_BINARY=node
../node_modules/react-native/packager/react-native-xcode.sh
```

To this:

```bash
export NODE_BINARY=node
export SENTRY_PROPERTIES=../sentry.properties

# If you are using RN 0.46+
../node_modules/@sentry/cli/bin/sentry-cli react-native xcode \
  ../node_modules/react-native/scripts/react-native-xcode.sh

# For RN < 0.46
../node_modules/@sentry/cli/bin/sentry-cli react-native xcode \
  ../node_modules/react-native/packager/react-native-xcode.sh
```

Additionally we add a build script called “Upload Debug Symbols to Sentry” which uploads debug symbols to Sentry.

#### Upload Debug Symbols to Sentry

If you wish to upload the source maps and symbols to Sentry, create a new Run Script build phase with the following script:

```bash
export SENTRY_PROPERTIES=../sentry.properties

../node_modules/@sentry/cli/bin/sentry-cli upload-dif "$DWARF_DSYM_FOLDER_PATH"
``` 

For bitcode enabled builds via iTunes Connect, additional steps are required.
Follow the instructions at [With Bitcode]({%- link
_documentation/clients/cocoa/dsym.md -%}#dsym-with-bitcode) to set up uploads of
symbols for all build variants.

Note that uploading of debug simulator builds by default is disabled for speed reasons. If you do want to also generate debug symbols for debug builds you can pass `--allow-fetch` as a parameter to `react-native-xcode` in the above mentioned build phase.

### Using node with nvm or notion

If you are using nvm or notion, Xcode seems to have problems locating the default node binary. In that case you should change the scripts to this:

Build failure in Xcode looks something like:

```bash
dyld: Library not loaded: /usr/local/opt/icu4c/lib/libicui18n.62.dylib
  Referenced from: /usr/local/bin/node
  Reason: image not found
```

Change the run scripts in Xcode to:

#### Bundle React Native code and images

```bash
# First set the path to sentry.properties
export SENTRY_PROPERTIES=sentry.properties

# Setup nvm and set node
[ -z "$NVM_DIR" ] && export NVM_DIR="$HOME/.nvm"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
. "$HOME/.nvm/nvm.sh"
elif [[ -x "$(command -v brew)" && -s "$(brew --prefix nvm)/nvm.sh" ]]; then
. "$(brew --prefix nvm)/nvm.sh"
fi

# Set up the nodenv node version manager if present
if [[ -x "$HOME/.nodenv/bin/nodenv" ]]; then
eval "$("$HOME/.nodenv/bin/nodenv" init -)"
fi

# Trying notion
if [ -z "$NODE_BINARY" ]; then
if [[ -s "$HOME/.notion/bin/node" ]]; then
export NODE_BINARY="$HOME/.notion/bin/node"
fi
fi

[ -z "$NODE_BINARY" ] && export NODE_BINARY="node"

$NODE_BINARY ../node_modules/@sentry/cli/bin/sentry-cli react-native xcode \
  ../node_modules/react-native/scripts/react-native-xcode.sh
```

#### Upload Debug Symbols to Sentry

```bash
# First set the path to sentry.properties
export SENTRY_PROPERTIES=sentry.properties

# Setup nvm and set node
[ -z "$NVM_DIR" ] && export NVM_DIR="$HOME/.nvm"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
. "$HOME/.nvm/nvm.sh"
elif [[ -x "$(command -v brew)" && -s "$(brew --prefix nvm)/nvm.sh" ]]; then
. "$(brew --prefix nvm)/nvm.sh"
fi

# Set up the nodenv node version manager if present
if [[ -x "$HOME/.nodenv/bin/nodenv" ]]; then
eval "$("$HOME/.nodenv/bin/nodenv" init -)"
fi

# Trying notion
if [ -z "$NODE_BINARY" ]; then
if [[ -s "$HOME/.notion/bin/node" ]]; then
export NODE_BINARY="$HOME/.notion/bin/node"
fi
fi

[ -z "$NODE_BINARY" ] && export NODE_BINARY="node"

# Run sentry cli script to upload debug symbols
$NODE_BINARY ../node_modules/@sentry/cli/bin/sentry-cli upload-dif "$DWARF_DSYM_FOLDER_PATH"
```

## Android

For Android we hook into gradle for the source map build process. When you run `react-native link` the gradle files are automatically updated.

We enable the gradle integration in your `android/app/build.gradle` file by adding the following line after the `react.gradle` one:

```gradle
apply from: "../../node_modules/react-native-sentry/sentry.gradle"
```

You can also enable logging for `sentry-cli` by adding this config before the above `apply from:` line:

```gradle
project.ext.sentryCli = [
    logLevel: "debug"
]
```

We also support fetching different `sentry.properties` files for different flavors. For that you need to add:

```gradle
project.ext.sentryCli = [
    logLevel: "debug",
    flavorAware: true
]
```

The corresponding flavor files should also be placed within the specific build type folder you intend to use them.  For example the "Android release" flavor would be `react-native/android/sentry-release.properties`.

We recommend leaving `logLevel: "debug"` since we look for specific `sentry.properties` files depending on your flavors name.

Include the project by adding it to our dependency list in `app/build.gradle`:

```java
dependencies {
    // ... other dependencies listed here //
    implementation project(':react-native-sentry')
}
```

Please make sure your `MainApplication.java` looks something like this:

```java
import io.sentry.RNSentryPackage;

public class MainApplication extends Application implements ReactApplication {

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new RNSentryPackage()
        );
    }

}
```


Add the following to your `settings.gradle` file:
```java
include ':react-native-sentry'
project(':react-native-sentry').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-sentry/android')
```

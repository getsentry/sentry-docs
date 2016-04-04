.. class:: platform-cocoa

Cocoa
=====

This is the documentation for our work in progress, official clients for
Cocoa.  This feature is currently under development and requires being
enrolled as early adopter on our hosted solution.

For Cocoa there are two clients available: one for `Objective-C`_, another
one for `Swift`_.  In either case you will need to `Upload Your Symbols`_
for us to be able to process your stacktraces.

Objective-C
-----------

The client can be installed using `CocoaPods <http://cocoapods.org>`__:

.. sourcecode:: ruby

    platform :ios, '8.0'
    use_frameworks!

    pod 'Sentry', :git => 'git@github.com:getsentry/sentry-objc.git'

Usage is pretty straightforward:

.. sourcecode:: objc

    #import "Sentry.h"

    - (BOOL)application:(UIApplication *)application
            didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        // Log all crashes to Sentry
        [Sentry installWithDsn:@"___DSN___"];
        return YES;
    }

    - (void)sendLogEventsToSentry {
        [Sentry logDebug:@"Send a debug log event to Sentry!"];
        [Sentry logInfo:@"Send an info log event to Sentry!"];
        [Sentry logWarning:@"Send a warning log event to Sentry!"];
        [Sentry logError:@"Send an error log event to Sentry!"];
        [Sentry logFatal:@"Send a fatal log event to Sentry!"];
    }

    - (void)sendQueuedEvents {
        // You must periodically call this to send queued events.
        // It will be called automatically on app startup only.
        [Sentry sendQueuedEvents];
    }

Swift
-----

The client can be installed using `CocoaPods <http://cocoapods.org>`__ or
`Carthage <https://github.com/Carthage/Carthage>`__.

To integrate SentrySwift into your Xcode project using CocoaPods, specify it in your `Podfile`:

.. sourcecode:: ruby

    source 'https://github.com/CocoaPods/Specs.git'
    platform :ios, '8.0'
    use_frameworks!

    pod 'SentrySwift', :git => 'git@github.com:getsentry/sentry-swift.git', :branch => 'master'

To integrate SentrySwift into your Xcode project using Carthage, specify
it in your `Cartfile`:

.. sourcecode:: ruby

    github "getsentry/sentry-swift" "master"

Run `carthage update` to build the framework and drag the built
`SentrySwift.framework` and `KSCrash.framework` into your Xcode project.

Client usage:

.. sourcecode:: swift

    func application(application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {

        // Create a Sentry client and start crash handler
        SentryClient.shared = SentryClient(dsnString: "___DSN___")	
        SentryClient.shared?.startCrashHandler()
        
        return true
    }

If you do not want to send events in a debug build, you can wrap the above code in something like...

.. sourcecode:: swift

    // Create a Sentry client and start crash handler when not in debug
    if !DEBUG {
        SentryClient.shared = SentryClient(dsnString: "___DSN___")
        SentryClient.shared?.startCrashHandler()
    }

Upload Your Symbols
-------------------

A dSYM upload is required for Sentry to symoblicate your crash logs for
viewing. The symoblication process unscrambles Apple's crash logs to
reveal the function, variables, file names, and line numbers of the crash.
The dSYM file can be uploaded through the
`sentry-cli <https://github.com/getsentry/sentry-cli>`__ tool or through a
`Fastlane <https://fastlane.tools/>`__ action.

With Bitcode
````````````

If `Bitcode <https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AppThinning/AppThinning.html#//apple_ref/doc/uid/TP40012582-CH35-SW2>`__
**is enabled** in your project, you will have to upload the dSYM to Sentry
**after** it has finished processing in the iTunesConnect. The dSYM can be
downloaded in three ways...

Use Fastlane
~~~~~~~~~~~~

Use the `Fastlane's <https://github.com/fastlane/fastlane>`__ action,
`download_dsyms`, to download the dSYMs from iTunesConnect and upload to
Sentry. The dSYM won't be generated unitl **after** the app is done
processing on iTunesConnect so this should be run in its own lane.

.. sourcecode:: ruby

    lane :upload_symbols do
      download_dsyms
      upload_sybols_to_sentry(
        api_key: '...',
        org_slug: '...',
        project_slug: '...',
      )
    end

Use 'sentry-cli`
~~~~~~~~~~~~~~~~

There are two ways to download the dSYM from iTunesConnect. After you do
one of the two following ways, you can upload the dSYM using
`sentry-cli <https://github.com/getsentry/sentry-cli/releases>`__.

1. Open Xcode Oraganizer, go to your app, and click "Download dSYMs..."
2. Login to iTunes Connect, go to your app, go to "Activity, click the
   build number to go into the detail page, and click "Download dSYM"

::

    sentry-cli --api-key YOUR_API_KEY upload-dsym --org YOUR_ORG_SLUG --project YOUR_PROJECT_SLUG PATH_TO_DSYM"

Without Bitcode
```````````````

Things are a bit easier if you do not use bitcode.

Use Fastlane
~~~~~~~~~~~~

.. sourcecode:: ruby

    lane :build do
      gym
      upload_sybols_to_sentry(
        api_key: '...',
        org_slug: '...',
        project_slug: '...',
      )
    end

Run Script with `sentry-cli`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Your project's dSYM can be upload during the build phase as a "Run
Script". By default, an Xcode project will only have
`DEBUG_INFORMATION_FORMAT` set to `DWARF with dSYM File` in `Release` so
make sure everything is set in your build settings properly.

1. You will need to copy the below into a new `Run Script` and set your
   `API_KEY`, `ORG_SLUG`, and `PROJECT_SLUG`
2. Download and install `sentry-cli <https://github.com/getsentry/sentry-cli/releases>`__
   — The best place to put this is in the `/usr/local/bin/` directory

Shell: `/usr/bin/ruby`

.. sourcecode:: ruby

    API_KEY = "your-api-key"
    ORG_SLUG = "your-org-slug"
    PROJECT_SLUG = "your-project-slug"

    Dir["#{ENV["DWARF_DSYM_FOLDER_PATH"]}/*.dSYM"].each do |dsym|
        cmd = "sentry-cli --api-key #{API_KEY} upload-dsym --org #{ORG_SLUG} --project #{PROJECT_SLUG} #{dsym}"
        Process.detach(fork {system cmd })
    end

Manually with `sentry-cli`
~~~~~~~~~~~~~~~~~~~~~~~~~~

Your dSYM file can be upload manually by you (or some automated process)
with the `sentry-cli` tool. You will need to know the following
information:

- API Key
- Organization slug
- Project slug
- Path to the build's dSYM

Download and install
`sentry-cli <https://github.com/getsentry/sentry-cli/releases>`__ — The best
place to put this is in the `/usr/local/bin/` directory.

Then run this::

    sentry-cli --api-key YOUR_API_KEY upload-dsym --org YOUR_ORG_SLUG --project YOUR_PROJECT_SLUG PATH_TO_DSYM"

Objective-C
===========

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
        // The last 10 of these will be sent along with the next crash report.

        [Sentry logDebug:@"Send a debug log event to Sentry!"];
        [Sentry logInfo:@"Send an info log event to Sentry!"];
        [Sentry logWarning:@"Send a warning log event to Sentry!"];
        [Sentry logError:@"Send an error log event to Sentry!"];
        [Sentry logFatal:@"Send a fatal log event to Sentry!"];

        [Sentry logNavigationFrom:@"main" to:@"settings"];

        [Sentry logUIEventOfType:@"touch" withTarget:@"start button"];
    }

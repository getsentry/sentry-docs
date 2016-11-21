.. class:: platform-cocoa

Cocoa
=====

.. sentry:support-warning::

    The new Cocoa SDK is a preview release.  Please give feedback if you
    encounter issues with it.

This is the documentation for our official clients for Cocoa (Objective-C
and Swift).

Installation
------------

The client (SentrySwift) can be installed using `CocoaPods
<http://cocoapods.org>`__ or `Carthage
<https://github.com/Carthage/Carthage>`__.  This is the recommended client
for both Swift and Objective-C.  If you need support for old versions of
iOS that do not support Swift you can use our alternative `Sentry-Objc
<https://github.com/getsentry/sentry-objc>`_ client.

To integrate SentrySwift into your Xcode project using CocoaPods, specify
it in your `Podfile`:

.. sourcecode:: ruby

    source 'https://github.com/CocoaPods/Specs.git'
    platform :ios, '8.0'
    use_frameworks!

    target 'YourApp' do
        pod 'SentrySwift', :git => 'git@github.com:getsentry/sentry-swift.git', :tag => '1.0.0'
    end

Afterwards run ``pod install``.  In case you encounter problems with
dependencies and you are on a newer CocoaPods you might have to run
``pod repo update`` first.

To integrate SentrySwift into your Xcode project using Carthage, specify
it in your `Cartfile`:

.. sourcecode:: ruby

    github "getsentry/sentry-swift" "1.0.0"

Run ``carthage update`` to build the framework and drag the built
`SentrySwift.framework` and `KSCrash.framework` into your Xcode project.

Configuration
-------------

To use the client, change your AppDelegate's `application` method to
instantiate the Sentry client:

.. sourcecode:: swift

    import SentrySwift;

    func application(application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {

        // Create a Sentry client and start crash handler
        SentryClient.shared = SentryClient(dsnString: "___DSN___")
        SentryClient.shared?.startCrashHandler()
        
        return true
    }

If you do not want to send events in a debug build, you can wrap the above
code in something like this:

.. sourcecode:: swift

    // Create a Sentry client and start crash handler when not in debug
    if !DEBUG {
        SentryClient.shared = SentryClient(dsnString: "___DSN___")
        SentryClient.shared?.startCrashHandler()
    }

If you prefer to use Objective-C you can do so like this:

.. sourcecode:: objc

    @import SentrySwift;

    [SentryClient setShared:[[SentryClient alloc] initWithDsnString:@"___DSN___"]];
    [[SentryClient shared] startCrashHandler];

Debug Symbols
-------------

Before you can start capturing crashes you will need to tell Sentry about the debug
information by uploading dSYM files.  Depending on your setup this can be
done in different ways:

*   :ref:`dsym-with-bitcode`
*   :ref:`dsym-without-bitcode`

Testing a Crash
---------------

If you would like to test the crash reporting you will need to cause a crash. While, the seemingly obvious method
would be make it crash on launch, this will not give the Sentry client a chance
to actually submit the crash report. Instead, we recommend triggering a crash
from a button tap.

You can use the following methods to cause a crash:

*   Swift:

    .. sourcecode:: swift

        [][0];

*   Objective-C:

    .. sourcecode:: objc

        int *x = 0; *x = 42;

*Note that if you crash with a debugger attached nothing will happen.*

Crashes are only submitted upon re-launching the
application. To test the crashing, close the app and launch it again from the
springboard.

Deep Dive
---------

.. toctree::
   :maxdepth: 2

   dsym
   advanced

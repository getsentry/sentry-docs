Swift
=====

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

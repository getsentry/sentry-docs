Swift
=====

The client can be installed using `CocoaPods <http://cocoapods.org>`__ or
`Carthage <https://github.com/Carthage/Carthage>`__.

To integrate SentrySwift into your Xcode project using CocoaPods, specify it in your `Podfile`:

.. sourcecode:: ruby

    source 'https://github.com/CocoaPods/Specs.git'
    platform :ios, '8.0'
    use_frameworks!

    target 'YourApp' do
        pod 'SentrySwift', :git => 'git@github.com:getsentry/sentry-swift.git', :branch => 'master'
    end

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

Client Information
``````````````````

A user, tags, and extra information can be stored on a `SentryClient`. This information will get sent with every message/exception in which that `SentryClient` sends up the Sentry. They can be used like...

.. sourcecode:: swift

    SentryClient.shared?.user = User(id: "3",
        email: "example@example.com",
        username: "Example",
        extra: ["is_admin": false]
    )

    SentryClient.shared?.tags = [
        "context": "production"
    ]

    SentryClient.shared?.extra = [
        "my_key": 1,
        "some_other_value": "foo bar"
    ]

All of the above (`user`, `tags`, and `extra`) can all be set at anytime and can also be set to nil to clear.

Sending Messages
````````````````

Sending a basic message (no stacktrace) can be done with `captureMessage`.

.. sourcecode:: swift

    SentryClient.shared?.captureMessage("TEST 1 2 3", level: .Debug)

If more detailed information is required, `Event` has a large constructor that allows for passing in of all the information or a `build` function can be called to build the `Event` object like below.

.. sourcecode:: swift

    let event = Event.build("TEST 1 2 3") {
        $0.level = .Debug
        $0.tags = ["context": "production"]
        $0.extra = [
            "my_key": 1,
            "some_other_value": "foo bar"
        ]
    }
    SentryClient.shared?.captureEvent(event)

..
  Breadcrumbs
  ```````````
  Breadcrumbs are used as a way to trace how an error occured. They will queue up on a `SentryClient` based on `type` and will be sent up on the next `error` or `fatal` message.
  
  .. sourcecode:: swift
  
      @IBAction func onClickBreak(sender: AnyObject) {
          let breadcrumb = Breadcrumb(uiEventType: "button", target: "onClickBreak")
          SentryClient.shared?.breadcrumbs.add(breadcrumb)
      }
  
  The client will queue up a maximum of 20 breadcrumbs for each type by default but this can be changed by setting `maxCrumbsForType`.
  
  .. sourcecode:: swift
  
      SentryClient.shared?.breadcrumbs.maxCrumbsForType = 10
  
  All of the different breadcrumb types below can be created...
  
  .. sourcecode:: swift
  
      // Type: message
      Breadcrumb(message: "", logger: "", level: .Info, classifier: "")
      
      // Type: rpc
      Breadcrumb(endpoint: "", params: [:], classifier: "")
      
      // Type: http_request
      Breadcrumb(url: "", method: "", headers: [:], statusCode: 404, response: "", reason: "", classifier: "")
      
      // Type: query
      Breadcrumb(query: "", params: "", classifier: "")
      
      // Type: ui_event
      Breadcrumb(uiEventType: "", target: "", classifier: "")
      
      // Type: navigation
      Breadcrumb(to: "", from: "")

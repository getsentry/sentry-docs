Advanced Usage
==============

Here are some advanced topics:


Sending Messages
----------------

Sending a basic message (no stacktrace) can be done with `captureMessage`.

.. sourcecode:: swift

    SentryClient.shared?.captureMessage("TEST 1 2 3", level: .Debug)

If more detailed information is required, `Event` has a large constructor
that allows for passing in of all the information or a `build` function
can be called to build the `Event` object like below.

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

Client Information
------------------

A user, tags, and extra information can be stored on a `SentryClient`.
This information will get sent with every message/exception in which that
`SentryClient` sends up the Sentry. They can be used like...

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

All of the above (`user`, `tags`, and `extra`) can all be set at anytime
and can also be set to nil to clear.

Sending Messages
----------------

Sending a basic message (no stacktrace) can be done with `captureMessage`.

.. sourcecode:: swift

    SentryClient.shared?.captureMessage("TEST 1 2 3", level: .Debug)

If more detailed information is required, `Event` has a large constructor
that allows for passing in of all the information or a `build` function
can be called to build the `Event` object like below.

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

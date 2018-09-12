---
title: 'Scopes'
sidebar_order: 3
---

All SDKs should have the concept of concurrency safe context storage. What this means depends on the language. The basic idea is that a user of the SDK can call a method to safely provide additional context information for all events that are about to be recorded.

This is implemented as a thread local stack in most languages, but in some (such as JavaScript) it might be global under the assumption that this is something that makes sense in the environment.

From the user's perspective of the Sentry SDK there are two relevant APIs:

## Scope

A scope holds data that should implicitly be sent with sentry events. It can hold context data, extra parameters, level overrides, fingerprints etc.

The user should be able to modify the current scope easily (to set extra, tags, current user), through a global function `configureScope`.  `configureScope` takes a callback function to which it passes the current scope. Here's an example from another place in the docs:

```javascript
Sentry.configureScope((scope) => {
  scope.setExtra("character_name": "Mighty Fighter");
});
```

Why not just have a `getCurrentScope()` function instead of this indirection?  If the SDK is disabled (e.g. by not providing a DSN), modifying a scope is pointless because there will never be any events to send. In that situation `configureScope` may choose not to call the callback.

- `scope.set_user(data)`: Shallow merges user configuration (`email`, `username`, …).  Removing user data is SDK-defined, either with a `remove_user` function or by passing nothing as data.

- `scope.set_extra(key, value)`: Sets the extra key to an arbitrary value, overwriting a potential previous value. Removing a key is SDK-defined, either with a `remove_extra` function or by passing nothing as data.

- `scope.set_tag(key, value)`: Sets the tag to a string value, overwriting a potential previous value.  Removing a key is SDK-defined, either with a `remove_tag` function or by passing nothing as data.

- `scope.set_context(key, value)`: Sets the context key to a value, overwriting a potential previous value.  Removing a key is SDK-defined, either with a `remove_context` function or by passing nothing as data. The types are sdk specified.

- `scope.set_fingerprint(fingerprint[])`: Sets the fingerprint to group specific events together

- `scope.clear()`: resets a scope to default values (prevents inheriting)

- `scope.apply_to_event(event[, max_breadcrumbs])`: Applies the scope data to the given event object. This also applies the event processors stored in the scope internally.  Some implementations might want to set a max breadcrumbs count here.

## Hub

The hub consists of a client and a stack of scopes.

The SDK maintains two variables: The *global hub* (a global variable) and the *current hub* (a variable local to the current thread or execution context, also sometimes known as async local or context local)

The `init()` you saw in the [_Overview_]({%- link _documentation/clientdev/overview.md -%}) typically creates / reinitializes the global hub which is propagated to all new threads/execution contexts, or a hub is created per thread/execution context. 

- `Hub::new(client, scope)`: Creates a new hub with the given client and scope.  The client can be reused between hubs. The scope should be owned by the hub (make a clone if necessary)

- `Hub::new_from_top(hub)` / alternatively native constructor overloads: Creates a new hub by cloning the top stack of another hub.

- `get_current_hub()` / `Hub::current()` / `Hub::get_current()`: Global function or static function to return the current (threads) hub

- `get_main_hub()` / `Hub::main()` / `Hub::get_main()`: In languages where the main thread is special this returns the main thread’s hub instead of the current thread’s hub. This might not exist in all languages.

- `Hub::capture_event` / `Hub::capture_message` / `Hub::capture_exception` Capture message / exception call into capture event. `capture_event` merges the event passed with the scope data and dispatches to the client.

- `Hub::push_scope()`: Pushes a new scope layer that inherits the previous data. This should return a disposable or stack guard for languages where it makes sense.

- `Hub::with_scope(func)` (optional): In Python this could be a context manager, in Ruby a block function. Pushes and pops a scope for integration work.

- `Hub::pop_scope()` (optional): Only exists in languages without better resource management. Better to have this function on a return value of `push_scope` or to use `with_scope`.

- `Hub::configure_scope(callback)`: Invokes the callback with a mutable reference to the scope for modifiations

- `Hub::add_breadcrumb(crumb)`: Adds a breadcrumb to the current scope.

  - The argument supported should be:
    - function that creates a breadcrumb
    - an already created breadcrumb object
    - a list of breadcrumbs optionally
  - In languages where we do not have a basic form of overloading only a raw breadcrumb object should be accepted.

- `Hub::client()` / `Hub::get_client()` (optional): Accessor or getter that returns the current client or `None`.

- `Hub::bind_client(new_client)`: Binds a different client to the hub. If the hub is also the owner of the client that was created by `init` it needs to keep a reference to it still if the hub is the object responsible for disposing it.

- `Hub::unbind_client()` (optional): Optional way to unbind for languages where `bind_client` does not accept nullables.  

- `Hub::add_event_processor(callback)`: Registers a callback with the hub that returns a callback that processes a specific event. This allows the processor to hold on to closure data until the scope might have to be sent to another thread:

  - `add_event_processor(() => (event) => …))`

  - The initial closure can be persisted until the scope needs to be stored or sent to a thread after which the inner closure is retained.

- `Hub::run(hub, callback)`  `hub.run(callback)`, `run_in_hub(hub, callback)` (optional): Runs a callback with the hub bound as the current hub.


## Convenience functions

The following shortcut functions should be exported in the top-level namespace of your package:

- `capture_event(event)`: Takes an already assembled event and dispatches it to the client

- `capture_exception(…)`: Report an error or exception. In Rust this does not exist: There are different kinds of exception types.

- `capture_message(message, level)`: Reports a message. The level can be optional in language with default parameters.

- `add_breadcrumb(crumb)`: Adds a new breadcrumb to the scope. If the total number of breadcrumbs exceeds the `maxBreadcrumbs` setting, the oldest breadcrumb should be removed in turn. This works like the Hub api with regards to what `crumb` can be.

- `configure_scope(callback)`: Calls a callback with a scope object that can be reconfigured. This is used to attach contextual data for future events in the same scope. This is a convenience alias to `Hub::current().configure_scope(…)`.

- `with_active_hub(callback)` / `Hub::with_active(callback)`: Invokes the callback which is passed the default hub if a client is bound or does nothing if the client is not bound.

  This one is intended for integrations and in some systems that might not be necessary to add. The advantage of having it means that a user cannot accidentally create a sentry structure in a disabled environment. Alternatively a user would need to check upfront if the client is active.

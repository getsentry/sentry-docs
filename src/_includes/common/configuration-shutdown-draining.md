# Shutdown and Draining

The default behavior of most {{ include.sdk_name }} SDKs is to send out events over the network asynchronously in the background. This means that some events might be lost if the application shuts down unexpectedly. Our JavaScript SDK provides mechanisms to cope with this:

The `close` method optionally takes a timeout in milliseconds and returns a promise that resolves when all pending events are flushed, or the timeout kicks in.


{{ include.shutdown_drain_content }}

After a call to `close`, the current client cannot be used anymore. 

Call `close` immediately before shutting down the application.

Alternatively, the `flush` method drains the event queue while keeping the client enabled for continued use.
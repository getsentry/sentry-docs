{% comment %}
Guideline: This page is common to all SDKs; it is stored in the common folder, nested under _includes/common. To use, 

1. If you haven't already, add the configuration content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/config (for example, _documentation/sdks/javascript/config). 
2. Create a copy of shutdown-drain.md file, then add it to the config folder. 
3. Add the SDK-specific `include` statements to the shutdown-drain.md file

If you have questions, please ask Fiona or Daniel. 
{% endcomment %}

The default behavior of most {{ include.sdk_name }} SDKs is to send out events over the network asynchronously in the background. This means that some events might be lost if the application shuts down unexpectedly. Our JavaScript SDK provides mechanisms to cope with this:

The `close` method optionally takes a timeout in milliseconds and returns a promise that resolves when all pending events are flushed, or the timeout kicks in.


{{ include.shutdown_drain_content }}

After a call to `close`, the current client cannot be used anymore. 

Call `close` immediately before shutting down the application.

Alternatively, the `flush` method drains the event queue while keeping the client enabled for continued use.
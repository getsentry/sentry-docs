{% comment %}
Guideline: This page is common to all SDKs; it is a largely a holding page to enable troubleshooting to be documented. It is stored in the common folder, nested under _includes/common. To use, 

1. If you haven't already, copy the troubleshooting content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/troubleshooting (for example, _documentation/sdks/javascript/troubleshooting). 
2. Edit the troubleshooting.md file to be specific to the SDK you are documenting.

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the troubleshooting information available for each SDK.**
{% endcomment %}
If you need help solving issues with your Sentry {{ include.sdk_name }} SDK integration, you can read the edge cases documented here. If you need additional help, you can view our forums, and customers on a paid plan may also contact support.


## Debugging Additional Data

You can view the JSON payload of an event to see how Sentry stores additional data in the event. The shape of the data may not exactly match the description.

[{% asset additional-data/event_JSON.png alt="Red box highlighting where to find the JSON connected to an event." width="400"%}]({% asset additional-data/event_JSON.png @path %})

For more details, see the [full documentation on Event Payload](https://develop.sentry.dev/sdk/event-payloads/).

{{ include.troubleshooting-content }}
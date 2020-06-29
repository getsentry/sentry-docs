<!--
Guideline: This page is common to all SDKs; it is stored in the common folder, nested under _includes/common. To use, 

1. Add a folder with the name of the platform you are documenting to the _documentation/sdks structure (for example, _documentation/sdks/javascript) 
2. Create a new config-<sdk>-intro.md file in _documentation/sdks/<platform-name> 
3. Create the defined `include` statements and add them to the configuration-intro.md file

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can view easily the configuration options for the SDK; each page _must_ have a description that includes a summary of what the page provides to the developer. Simply linking the page is insufficient.**
-->

# Configuration Options

Sentry's {{ include.sdk_name }} SDK includes many configuration options that are automatically set. You can configure your SDK using the options outlined in these pages:

- **[Basic Options](/sdks/{{ include.root_link }}/config/basics)** 

    Learn more about how to configure the {{ include.sdk_name }} SDK. These options are set when the SDK is first initialized, passed to the `init()` as an object. In addition, this page discusses the Hooks `beforeSend` and `beforeBreadcrumb` in addition to transport options.

- **[Filter Events Reported to Sentry](/sdks/{{ include.root_link }}/config/filter)**

    Learn more about how to filter events reported to Sentry, using either the SDK, product filtering options, or both.

{{ include.config-page_content }}
<!--
Guideline: Create the `include` statement that links to the pages specific to the SDK you are documenting. For example, here we link to Source Maps, Lazy Loading, Shutdown and Draining, and Supported Browsers for JavaScript
--> 

- **[Shutdown and Draining](/sdks/{{ include.root_link }}/config/shutdown-drain)**

    Learn more about the default behavior of our {{ include.sdk_name }} SDK if the application shuts down unexpectedly.
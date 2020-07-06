{% comment %}
Guideline: This page is common to all SDKs; it is stored in the common folder, nested under _includes/common. To use, 

1. Add a folder with the name of the platform you are documenting to the _documentation/sdks structure (for example, _documentation/sdks/javascript) 
2. Create a new errors folder and new errors.md file in _documentation/sdks/<platform-name> 
3. Create the defined `include` statements and add them to the intro.md file

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the error data that enriches each SDK; each page _must_ have a description that includes a summary of what the page provides to the developer. Simply linking the page is insufficient.**
{% endcomment %}

When your SDK sends an event to Sentry, the event is enriched with data that helps you identify the source of the event and includes information both pertinent to the event as well as a full picture of what led up to the event.

- **[Event Context](/sdks/{{ include.root_link }}/errors/context)** 

    Learn more about what data is sent with every event and the form the data can take. 
    
- **[Breadcrumbs](/sdks/{{ include.root_link }}/errors/breadcrumbs)** 

    Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prior to an issue. 
    
- **[Environments](/enriching-error-data/environments/)**

    Learn more about how environments help you better filter issues, releases, and user feedback in the Issue Details page of the web UI.
    
- **[Releases](workflow/releases/)**

    Learn more about how to send release data so Sentry can tell you about regressions between releases and identify the potential source.
    
    
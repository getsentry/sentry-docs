{% comment %}
Guideline: This page is common to all SDKs; it is stored in the common folder, nested under _includes/common. To use, 


1. If you haven't already, add the errors content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/errors (for example, _documentation/sdks/javascript/errors). 
2. Create a copy of intro.md file in _documentation/sdks/<platform-name>/errors 
3. Create the defined `include` statements and add them to the errors-intro.md file

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the error data that enriches each SDK; each page _must_ have a description that includes a summary of what the page provides to the developer. Simply linking the page is insufficient.**
{% endcomment %}

When your SDK sends an event to Sentry, the event is enriched with data. This data helps you identify the source of the event and includes information both pertinent to the event as well as a full picture of what led up to it.

- **[Event Context](/sdks/{{ include.root_link }}/errors/context)** 

    Learn more about what data is sent with every event, the form the data can take, and how you can modify the defaults. 
    
- **[Breadcrumbs](/sdks/{{ include.root_link }}/errors/breadcrumbs)** 

    Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prior to an issue. 
    
- **[Environments](/enriching-error-data/environments/)**

    Learn more about how environments help you better filter issues, releases, and user feedback in the Issue Details page of the web UI.
    
- **[Releases](/workflow/releases/)**

    Learn more about how to send release data so Sentry can tell you about regressions between releases and identify the potential source.
    
{{ include.error_page_content }}

{% comment %}
Guideline: Create the `include` statement that links to the pages specific to the SDK you are documenting. For example, here we link to the user feedback widget content for JavaScript.
{% endcomment %}
    
    
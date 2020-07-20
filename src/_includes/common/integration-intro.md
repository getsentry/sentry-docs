{% comment %}
Guideline: This page is common to all SDKs; it is stored in the common folder, nested under _includes/common. To use, 

1. If you haven't already, add the integrations content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/integrations (for example, _documentation/sdks/javascript/integrations). 
2. Create a copy of intro.md file in _documentation/sdks/<platform-name>/integrations
3. Create the defined `include` statements and add them to the integration-intro.md file

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the system, pluggable, and custom integrations available for each SDK; each page _must_ have a description that includes a summary of what the page provides to the developer. Simply linking the page is insufficient.**
{% endcomment %}

Integrations extend the functionality of our {{ include.sdk_name }} SDK to cover common libraries and environments automatically. 

- **[Default Integrations](/sdks/{{ include.root_link }}/integrations/default)** 

    Learn more about system integrations {{ include.integration_system-content }} that are enabled by default to integrate into the standard library or the interpreter itself. 
    
- **[Pluggable Integrations](/sdks/{{ include.root_link }}/integrations/plugin)**
    
    Learn more about pluggable integrations {{ include.integration_pluggable-content }}, which are snippets of code that augment functionality for specific applications and/or frameworks.
    
- **[Adding a Custom Integration](/sdks/{{ include.root_link }}/integrations/custom)**

    Learn how you can enable a custom integration.
    
{{ include.integration_framework}}

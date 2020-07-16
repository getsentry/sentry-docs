{% comment %}
Guideline: This page is common to all SDKs; it is a largely a holding page to enable custom integrations to be documented. It is stored in the common folder, nested under _includes/common. To use, 

1. If you haven't already, copy the integrations content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/integrations (for example, _documentation/sdks/javascript/integrations). 
2. Edit the default.md file to be specific to the SDK you are documenting

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the default integrations available for each SDK.**
{% endcomment %}
All of Sentry’s SDKs provide integrations, which extend functionality of the SDK.

System integrations are enabled by default to integrate into the standard library or the interpreter itself. They are documented so you can be both aware of what they do and disable them if they cause issues. 

## Enabled by Default

{{ include.default-integrations}}

## Modifying System Integrations

{{ include.modify-integration }}

### Removing an Integration

In this example, we will remove the default-enabled integration for adding breadcrumbs to the event:

{{ include.remove-integration }}
{% comment %}
Guideline: This page is common to all SDKs; it is a largely a holding page to enable custom integrations to be documented. It is stored in the common folder, nested under _includes/common. To use, 

1. If you haven't already, copy the integrations content folder to the directory of the platform you are documenting -- _documentation/sdks/<sdk/platform>/integrations (for example, _documentation/sdks/javascript/integrations). 
2. Edit the custom.md file to be specific to the SDK you are documenting

If you have questions, please ask Fiona or Daniel. 

**The objective for this page is that a developer can easily view the custom integrations available for each SDK.**
{% endcomment %}
Add a custom integration to your {{ include.sdk_name }} using the following format:

{{ include.custom-integration}}
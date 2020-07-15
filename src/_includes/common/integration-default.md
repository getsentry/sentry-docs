All of Sentry’s SDKs provide integrations, which extend functionality of the SDK.

System integrations are enabled by default to integrate into the standard library or the interpreter itself. They are documented so you can be both aware of what they do and disable them if they cause issues. 

## Enabled by Default

{{ include.default-integrations}}

## Modifying System Integrations

{{ include.modify-integration }}

### Removing an Integration

In this example, we will remove the default-enabled integration for adding breadcrumbs to the event:

{{ include.remove-integration }}
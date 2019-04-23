---
title: UI Components
sidebar_order: 0
---

The Sentry Integration Platform provides developers with the ability to define User Interface components they want to render within specific parts of Sentry's UI, through a JSON-based schema.

# Use-Cases

Currently, we support two types of UI components.

## Issue Linking

With issue linking, the developer can connect Sentry issues with a task in their project management system. This functionality provides a way to use any project management tool the developer uses or develops.

## Stack Trace Link

 This feature allows the developer to insert a link within a stack trace frame. The link contains details about the project, file, line number, etc. It can also be used to view the file on another website, continue debugging in a different monitoring tool, etc.

For more details on each component, see Component Details at the bottom of the page.

# Schema

The UI components are specified in the schema section of integration details. The required form of this schema is:

```
{
    "elements": [
        // Each element is a specification for a component the developer wants to use.
        ...
    ]
}
```

# Component Details

## **Issue Link**

The Issue Link component displays "Link <Service> Issue" in the Issue sidebar, which opens a modal allowing the user to create or link the issue to a task in the external service. For example, this is what our Clubhouse integration looks like.

[{% asset clubhouse/clubhouse_create_story_with_issue.png alt="Sentry modal that creates a Clubhouse Story that's linked to a Sentry issue." %}]({% asset clubhouse/clubhouse_create_story_with_issue.png @path %})

**Schema**

```
{
    "type": "issue-link",
    "link": {
        "uri": <str>,
        "required_fields": <Array<FormField>>,
    "optional_fields": <Array<FormField>>
    },
    "create": {
        // Same as "link" schema
    }
}
```

**Attributes of the link and create fields:**

- uri - (Required) The URI to request when the User submits the Link/Create Issue form.
- required_fields - (Required) List of `FormField` components the User is required to complete.
- optional_fields - List of optional `Form Field` components the User *may* complete.

A `FormField` can be one of three types (which behave like their HTML equivalents) — `Select`, `Text`, and `TextArea,` described below.

## **Select**

```
{
    "type": "select",
    "label": <String>,
    "name": <String>,
    "uri": <URI>,
    "async": <Bool>,
    "options": <Array<String, String>>,
}
```

**Attributes**

- label - (Required) Label text to be rendered for the form field
- name - (Required) Value to use in `name` attribute of the field
- uri -(Required if developer doesn't provide `options`) URI to retrieve values from.
- async - Used only if `uri` is present. If true, will query the URI as the user types, for autocomplete suggestions (see response format below). If false (default), will query the URI once initially to retrieve all possible options. This request *must* succeed, and the response *must* return data in the format Sentry expects, otherwise the entire component won't render.
- options - (Required if developer doesn't provide `uri`) Static list of options in the format of [label, value]

**URI Response Format**

Response from `uri`, when specified, *must* be in the following format:

```
[
    {
        "label": <String>,
        "value": <String>,
        "default": <Bool>, (optional)
    },
    ...
]
```

## **Text**

**Schema**

```
{
    "type": "text",
    "label": <String>,
    "name": <String>,
    (optional) default: <String>,
}
```

**Attributes**

- label - (Required) Label text to be rendered for the form field
- name - (Required) Value to use in `name` attribute of the field
- default - default to pre-populate with. Options include `issue.title` and `issue.description`
    - `issue.title` - title of the Sentry issue
    - `issue.description` - description of the Sentry issue

## **Textarea**

**Schema**

```
{
    "type": "textarea",
    "label": <String>,
    "name": <String>,
    (optional) default: <String>,
}
```

**Attributes**

- label - (Required) Label text to be rendered for the form field
- name - (Required) Value to use in `name` attribute of the field
- default - default to pre-populate with options include `issue.title` and `issue.description`
    - `issue.title` - title of the Sentry issue
    - `issue.description` - description of the Sentry issue

**Example of a complete issue-link schema**

```
{
    "elements": [
        {
            "type": "issue-link",
            "link": {
                "uri": "/sentry/issues/link",
                "required_fields": [
                    {
                        "type": "select",
                        "label": "Issue",
                        "name": "issue_id",
                        "uri": "/sentry/issues"
                    }
                ]
            },
            "create": {
                "uri": "/sentry/issues/create",
                "required_fields": [
                    {
                        "type": "text",
                        "label": "Title",
                        "name": "title"
                    }
                ],
                "optional_fields": [
                    {
                        "type": "select",
                        "label": "Owner",
                        "name": "owner",
                        "uri": "/sentry/members",
                        "async": true
                    }
                ]
            }
        }
    ]
}
```

## Stack Trace Link

For an example use-case, see the stack trace link use-case at the top of the page.

**Schema**

```
{
    "type": "stacktrace-link",
    "uri": <URI>,
}
```

**Attributes:**

- uri - (Required) The link destination. We will automatically add the following query params to the link.
    - `installationId`: Your integration's installation ID (helps you determine the requesting Sentry org)
    - `projectSlug`: slug of the project the issue belongs to
    - `filename`: full path of the stack frame file
    - `lineNo`: line number of the stack trace in the file

**Example:** 

```
"elements": [
    {
        "type": "stacktrace-link".
        "uri": "/stacktrace-redirect",
    }
]
```

Any time a component supports a `uri` attribute, Sentry will make a request to the third-party service using the Base URL or their `webhook_url`.

{% capture __alert_content -%}
For a more complete description of the grammar, see the [source code](https://github.com/getsentry/sentry/blob/master/src/sentry/api/validators/sentry_apps/schema.py).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

# Supplementary Information

## Error Handling

Component rendering either 100% works or shows nothing. To protect the integration from looking chaotic due to errors we have no control over; if any part of the third-party component rendering fails, nothing will render.

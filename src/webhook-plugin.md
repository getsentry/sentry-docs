---
title: 'Webhook Plugin'
---

### Webhook Plugin

**Attributes**

**data['id']**
- type: string
- description: The issue id for the issue associated with the event

**data['project']**
- type: string
- description: The project slug for the project associated with the event

**data['project_name']**
- type: string
- description: The project name for the project associated with the event

**data['project_slug']**
- type: string
- description: The project slug for the project associated with the event

**data['logger']**
- type: string
- description: value of the logger tag if available 

**data['level']**
- type: string
- description: the level of the event (`info`, `debug`, `warning`, `error`, `fatal`)

**data['culprit']** (maybe be deprecated)
- type: string
- description: value of the logger tag if available 

**data['message']** 
- type: string
- description: value of the logger tag if available 

**data['url']**
- type: url
- description: web url for the issue associated with the event

**data['triggering_rules']**
- type: array
- description: value of the logger tag if available 

**data['event']**
- type: object
- description: the event that triggered the alert rule

**data['event']['tags']**
- type: array
- description: the tags for the event

**data['event']['event_id']**
- type: string
- description: the client side generated eventid

**data['event']['id']**
- type: string
- description: same value as the `event_id`, for backwards compatability

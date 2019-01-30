---
title: Permissions
sidebar_order: 3
---

If you're building on top of Sentry's API (i.e using [Auth Tokens]({%- link _documentation/api/auth.md -%})), you'll need certain scopes to access
different API endpoints.

If you're looking for information on membership roles please visit the
[membership]({%- link _documentation/accounts/membership.md -%}) documentation.

### Organizations

```bash
GET      'org:read'    
PUT/POST 'org:write'
DELETE   'org:admin'
```

### Projects
```bash
GET      'project:read'    
PUT/POST 'project:write'
DELETE   'project:admin'
```

{% capture markdown_content %}
The `project:releases` scope will give you access to both **project**
and **organization** release endpoints. The available endpoints are listed in the
[Releases]({%- link _documentation/api/releases/index.md -%}) section of the API Documentation.
{% endcapture %}
{% include components/alert.html
  title="Note"
  content=markdown_content
%}

### Teams
```bash
GET      'team:read'    
PUT/POST 'team:write'
DELETE   'team:admin'
```

### Members
```bash
GET      'member:read'    
PUT/POST 'member:write'
DELETE   'member:admin'
```

### Issues & Events

{% capture markdown_content %}
**PUT/DELETE** methods only apply to updating/deleting issues.
Events in sentry are immutable and can only be deleted by deleting the whole issue.
{% endcapture %}
{% include components/alert.html
  title="Note"
  content=markdown_content
%}

```bash
GET      'event:read'    
PUT      'event:write'
DELETE   'event:admin'
```

### Releases
```bash
GET/PUT/POST/DELETE   'project:releases'
```

---
title: Permissions
sidebar_order: 3
---

If you're building on top of Sentry's API (i.e using [Auth Tokens](/api/auth/)), you'll need certain scopes to access
different API endpoints.

If you're looking for information on membership roles please visit the
[membership](/accounts/membership/) documentation.

### Organizations

| **GET**       | `org:read`  |
| **PUT/POST**  | `org:write` |
| **DELETE**    | `org:admin` |

### Projects

| GET      | `project:read`  |
| PUT/POST | `project:write` |
| DELETE   | `project:admin` |

{% capture markdown_content %}
The `project:releases` scope will give you access to both **project**
and **organization** release endpoints. The available endpoints are listed in the
[Releases](/api/releases/) section of the API Documentation.
{% endcapture %}
{% include components/alert.html
  title="Note"
  content=markdown_content
  level="warning"
%}

### Teams

| **GET**      | `team:read`  |
| **PUT/POST** | `team:write` |
| **DELETE**   | `team:admin` |

### Members

| **GET**      | `member:read`  |
| **PUT/POST** | `member:write` |
| **DELETE**   | `member:admin` |

### Issues & Events

| **GET**     | `event:read`  |
| **PUT**     | `event:write` |
| **DELETE**  | `event:admin` |

{% capture markdown_content %}
**PUT/DELETE** methods only apply to updating/deleting issues.
Events in sentry are immutable and can only be deleted by deleting the whole issue.
{% endcapture %}
{% include components/alert.html
  title="Note"
  content=markdown_content
  level="warning"
%}

### Releases

| **GET/PUT/POST/DELETE**  | `project:releases` |

{% capture markdown_content %}
Be aware that if you're using `sentry-cli` to [manage your releases](/cli/releases/), you'll need a token which also has `org:read` scope.
{% endcapture %}
{% include components/alert.html
  title="Note"
  content=markdown_content
  level="warning"
%}

<style>
.prose table td {
  width: 50%;
}
</style>

---
title: Integration Platform
sidebar_order: 2
---

Sentry’s Integration Platform provides a way for external services to interact with the Sentry SaaS service using the REST API and webhooks. Integrations utilizing this platform are first-class actors within Sentry, and you can build them for [LINK: public](links to the public section below) as well as [LINK: internal ](links to the internal section below) use cases.  

[ SCREENSHOT: screenshot of the developer settings page where you can choose b/n public  and internal ]

## Creating an Integration

In Sentry, navigate to Organization Settings > Developer Settings. From here, you can choose to create a New Internal Integration or New Public Integration. 

[ SCREENSHOT: screenshot of the developer settings page where you can choose b/n public  and internal ]

### Permissions

Permissions specify what level of access your service requires of Sentry resources. For public integrations, Sentry will prompt users to approve of these permissions upon installation. For more information on Permissions, [see full documentation]({%- link _documentation/api/permissions.md -%}).

[{% asset integration-platform-index/permissions.png alt="Form that allows developer to set what permissions they'll need from their user." %}]({% asset integration-platform-index/permissions.png @path %})

### Webhooks
Webhooks allows your service to get requests about specific resources, depending on your selection. For more information, see the [ LINK: full documentation on webhooks ](links to the webhook section).

## Public Integrations

Sentry built public integrations for the 'general public' of Sentry users. Public integrations start in an unpublished state for development purposes and can later be submitted for approval to publish. For more information, see the [ LINK: full documentation on publishing](links to publication state).

The  code examples in the sections below demonstrate a potential use-case that involves a Flask app receiving new issue webhooks from Sentry, calling the Sentry API for more data about the issue, and pushing it to Pushover as a generator of desktop/mobile notifications.

###  Installation

Users will have the option to install your integrations on the Integrations Page in Sentry. If your integration is still in an unpublished state, the only Sentry organization that will be able to install that integration will be the organization that created the integration. Clicking 'Install' will allow users to see a description of your integration and the option to 'Continue' accepting permissions needed for installation. 

[ SCREENSHOT: screenshot of integrations page? ]

#### OAuth Process

After installation, if your user has approved of all permissions, Sentry will generate a grant code and an installation ID. This information, the grant code, and the installation ID are sent via the `installation.created` webhook to the Webhook URL specified in your configuration. 

However, if your integration has a Redirect URL configured, the integration redirects the user’s browser to the configured URL with the grant code and installation ID in the query params.

Start your build by implementing the Redirect URL endpoint, /setup — typically where you exchange the grant code for an access token that allows you to make API calls to Sentry.

```python
    import requests
    from flask import redirect, request

    @app.route('/setup', methods=['GET'])
    def setup():
        code = request.args.get('code')
        install_id = request.args.get('installationId')
        
        url = u'https://sentry.io/api/0/sentry-app-installations/{}/authorizations/'
        url = url.format(install_id)
        
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': 'your-client-id',
            'client_secret': 'your-client-secret',
        }
        
        resp = requests.post(url, json=payload)
        data = resp.json()
        
        access_token = data['token']
        refresh_token = data['refreshToken']
        # ... Securely store the install_id, access_token and refresh_token in DB ...
        
        return redirect('http://sentry.io/settings/')
```

#### Verifying Installations (optional)

Typically if you have the Redirect URL configured, there is work happening on your end to 'finalize' the installation. If this is the case, we recommend enabling the Verify Install option for your integration. Once enabled, you will need to send a request marking the installation as officially 'installed.'

```python
requests.put(
    'https://sentry.io/api/0/sentry-app-installations/{}/'.format(install_id),
    json={'status': 'installed'},
)
```

In the case a user has not completed the setup on your end, whatever the case may be, Sentry will show the installation as 'pending' in the UI. 

[ SCREENSHOT: screenshot of pending state ]

#### Refreshing Tokens

The Access Tokens you receive from Sentry expire after eight hours. To retrieve a new token, you’ll make a request to the same Authorization endpoint used in the /setup endpoint above, but with a slightly different request body.

```python
    def refresh_token(install_id):
        url = u'http://sentry.io/api/0/sentry-app-installations/{}/authorizations/'
        url = url.format(install_id)
        
        refresh_token = retrieve_refresh_token_from_db(install_id)
        
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': 'your-client-id',
            'client_secret': 'your-client-secret',
        }
        
        resp = requests.post(url, json=payload)
        data = resp.json()
        
        new_access_token = data['token']
        new_refresh_token = data['refreshToken']
        # ... Securely update the access_token and refresh_token in DB...
        
        return new_access_token
```

### Uninstallation

When a user uninstalls your integration, you will receive a webhook request to your Webhook URL. 

### Webhooks

In addition to the [un]installation webhook requests, all of the webhooks that you selected when configuring your integration will be routed to your Webhook URL. 

Continuing from our example, here we're implementing the Webhook URL endpoint, /webhook. In this case, that includes when an issue is created. In this method, you'll use the Sentry API to check if the issue belongs to a project called Backend, and if it does, you'll forward the issue to Pushover.

```python
    @app.route('/webhook', methods=['POST'])
    def webhook():
        data = json.loads(request.data)
        
        if data['action'] != 'created':
            return
        
        issue_id = data['data']['issue']['id']
        install_id = data['installation']['uuid']
        
        issue_details = get_sentry_issue(install_id, issue_id)
        
        if issue_details['project']['name'] != 'Backend':
            return
            
        event = data['data']['event']
        
        payload = {
            'user': 'pushover-user-key',
            'token': 'pushover-api-token',
            'message': event['message'][:1024],
            'title': event['message'][:250],
            'url': event['url'],
            'url_title': 'Issue Details',
            'priority': 0,
        }
        requests.post('https://api.pushover.net/1/messages.json', data=payload)

    def get_sentry_issue(install_id, issue_id):
        access_token = retrieve_from_db(install_id)
        
        url = 'https://sentry.io/api/0/issues/{}/'.format(issue_id)
        headers = {'Authorization': 'Bearer {}'.format(access_token)}
        
        resp = requests.get(url, headers=headers)
        return resp.json()
```

For more information, see the [LINK: full documentation on Webhooks ](ink to larger Webhooks section below )

### Alerts

There is an option called Alert Rule Action for the integration platform. What this means is that, when enabled, your integration will show up as a service in the action section when creating a new alert rule. For more information, see the [LINK: full documentation on alert rules](https://docs.sentry.io/workflow/notifications/alerts/).

[SCREENSHOT: screenshot of the dropdown menu for alert rules ]

For your service to receive webhooks for alert rules, users must add to existing rules or create new ones that have `Send a notification via <your service>` as an action in the rule. Once that's set up, you'll start receiving webhook requests for triggered alerts. For more information about the request and payload, see the [LINK: webhooks section below](link to Webhooks section).

### Published State

When you are ready for the publication process, you can click the 'publish' button next to the integration you wish to submit. This will send an email to partners@sentry.io letting us know your integration is ready for review. 

[ SCREENSHOT: screenshot of publish button ]

## Internal Integrations

Internal integrations are meant for custom integrations unique to your organization. They can also be as simple as an organization-wide token. Whether you are using just the API or all the Integration Platform features combined, internal integrations are for use within a single Sentry organization. 

### Installation

Creating an internal integration will automatically install it on your organization. 

### Alerts

Alerts are the same as public integrations -- see the [LINK: Alerts section above under Public Integrations](link to Alerts section under Public Integrations) for general information and see the [LINK: Alerts section under Webhooks] for more detail on the request and payload. 

### Webhooks

Since internal integrations are automatically installed (and uninstallation is essentially deleting the whole integration), there are no [un]installation webhooks. For more information, see the [LINK: full documentation on Webhooks ]( link to larger Webhooks section below).

## API Token(s)

Sentry's Integration Platform uses API Tokens, which are a similar concept to Access Tokens.

### Public

#### 1. Token Exchange

Upon the initial installation, you'll need the grant code given to you in either the installation webhook request or the redirect URL, in addition to your integration's client ID and client Secret.

```python
url = 'https://sentry.io/api/0/sentry-app-installations/{}/authorizations/'
url = url.format(install_id)

payload = {
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': 'your-client-id',
    'client_secret': 'your-client-secret',
}
```

Tokens expire after eight hours, so you'll need to refresh your tokens accordingly. 

```python
url = 'http://sentry.io/api/0/sentry-app-installations/{}/authorizations/'
url = url.format(install_id)

refresh_token = retrieve_refresh_token_from_db(install_id)

payload = {
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token,
    'client_id': 'your-client-id',
    'client_secret': 'your-client-secret',
}
```

The data you can expect back for both the initial grant code exchange and subsequent token refreshes is as follows:

```python
{
	'token': '<example_token_value',
	'refreshToken': '<example_refresh_token_value>',
	# all the other things im forgetting plz add thnx bai
}
```

#### 2. How to use for requests

When making requests to the Sentry API, you use the access token just like you would when you're typically making [LINK:  API requests ](https://docs.sentry.io/api/auth/). 

- **Public Integrations**: tokens are associated with the installation, meaning they have access to the Sentry organization that installed your integration. 

- **Internal Integrations**: tokens are associated with the Sentry organization that created the integration (and therefore was automatically installed). 

#### 3. Expiration

- **Public Integrations**: tokens expire every eight hours

- **Internal Integrations**: tokens never expire, but you can [ LINK: manually revoke them ](link to token section below)

### Internal

When you create an internal integration, an access token is automatically generated. Should you need multiple, or you need to swap it out, you can go into your Developer Settings > Your Internal Integration and do so.

[SCREENSHOT: screenshot of tokens]

You can have up to 20 tokens at a time for any given internal integration.

### Using API Tokens

Authentication tokens are passed using an auth header, and are used to authenticate as a user account with the API. For more information, see the [LINK: full documentation on Authentication ](https://docs.sentry.io/api/auth/).

## Webhooks

Webhooks allows your service to get requests about specific resources, depending on your selection.

### Headers

All webhooks will contain the following set of request headers: 

```
    {
    'Content-Type': 'application/json',
    'Request-ID': <request_uuid>,
    'Sentry-Hook-Resource': <resource>,
    'Sentry-Hook-Timestamp': six.text_type(int(time())),
    'Sentry-Hook-Signature': <generated_signature>
    }
```

**`Sentry-Hook-Resource`**

This is the resource that triggered the action. The action will be in the payload.

**Resources**

- installation
- event_alert (payload will be a serialized event)
- issue

**`Sentry-Hook-Signature`**

A hash generated using your Client Secret and the request itself – used to verify the authenticity of the request.

### Verifying the Signature

```python
    body = json.dumps(request.body)
    expected = hmac.new(
        key=client_secret.encode('utf-8'),
        msg=body,
        digestmod=sha256,
    ).hexdigest()

    if not expected == request.headers['Sentry-Hook-Signature']:
            raise UnauthorizedError
```

### Request Structure

All webhook requests have some common elements.

**action**
: The action that corresponds with the resource in the header. For example, if the resource is `issue` the action could be `created` (among other options).

**installation**

: The installation is just an object with the `uuid` of the installation so that you know to map the webhook request to the appropriate installation. 

**data**

: The data object contains information about the resource and will differ in content depending on the type of webhook.

**actor**

: The actor is who, if anyone, triggered the webhook. If a user in Sentry triggered the action, then the actor is the user. If the Sentry App itself triggers the action, then the actor is the Application. And if the action is triggered automatically somehow within Sentry, then the actor is ‘Sentry.’

```python
    Samples cases:

    # user installs sentry app

    "actor": {
    'type': 'user',
    'id': <user-id>,
    'name': <user-name>, 
    }
    
    # sentry app makes request assign an issue

    "actor": {
    'type': 'application',
    'id': <sentry-app-uuid>,
    'name': <sentry-app-name>, 
    }, 
    
    # sentry (sentry.io) auto resolves an issue

    "actor": {
    'type': 'application',
    'id': 'sentry',
    'name': 'Sentry', 
    },
```

### Event Types
**1. [Un]Installation**

`'Sentry-Hook-Resource': 'installation'`

`'Sentry-Hook-Resource': 'uninstallation'`

#### Attributes

**action**
- type: string
- description: will either be `created` or `deleted`

**data['installation']**
- type: object
- description: The installation

**actor**
- type: object
- description: The user who either installed or uninstalled the integration 

```python
    {
    "action": "created",
    "installation": {
        "uuid": <install-uuid>
    },
    "data": {
        "installation": {
        "app": {
            "uuid": <app-uuid>,
            "slug": "your-app-slug"
        }
        "organization": {
            "slug": "sentry-org-slug"
        },
        "uuid": <install-uuid>,
        "code": <grant-code>
        }
    },
    "actor": {
        'type': 'user',
        'id': <user-id>,
        'name': <user-name>, 
    },  
    }
```

#### 2. Alerts 

`'Sentry-Hook-Resource': 'event_alert'`

##### Attributes

**action**
- type: string
- description: will always be `triggered`

**data['event']**
- type: object
- description: the event that triggered the alert rule

**data['event']['url']**
- type: string
- description: the api url for the event

**data['event']['web_url']**
- type: string
- description: the web url for the event

**data['event']['issue_url']**
- type: string
- description: the api url for the associated issue

**data['triggered_rule']**
- type: string
- description: The label of the rule that was triggered 







### Resource Subscriptions

Selecting a resource subscription determines the types of webhook requests sent to your service. Currently you can get requests for issues when they are created, assigned, ignored, or resolved. 

[{% asset integration-platform-index/resource-subscription.png alt="Screenshot of what the resource subscription looks like." %}]({% asset integration-platform-index/resource-subscription.png @path %})

## Building the Integration

After installation, if your user has approved of all permissions, Sentry will generate a grant code and an installation ID. If your integration has a Redirect URL configured, the integration redirects the user's browser to the configured URL with the grant code and installation ID in the query params.

Start your build by implementing the Redirect URL endpoint, `/setup` — typically where you exchange the grant code for an access token that allows you to make API calls to Sentry. 

```python
import requests
from flask import redirect, request

@app.route('/setup', methods=['GET'])
def setup():
    code = request.args.get('code')
    install_id = request.args.get('installationId')
    
    url = u'http://sentry.io/api/0/sentry-app-installations/{}/authorizations/'
    url = url.format(install_id)
    
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': 'your-client-id',
        'client_secret': 'your-client-secret',
    }
    
    resp = requests.post(url, json=payload)
    data = resp.json()
    
    access_token = data['token']
    refresh_token = data['refreshToken']
    # ... Securely store the install_id, access_token and refresh_token in DB ...
    
    return redirect('http://sentry.io/settings/')
```

Next, implement the Webhook URL endpoint, `/webhook`, which receives requests based on your resource subscriptions. In this case that includes when an issue is created. In this method, you'll use the Sentry API to check if the issue belongs to a project called Backend, and if it does, you'll forward the issue to Pushover.

```python
@app.route('/webhook', methods=['POST'])
def webhook():
    data = json.loads(request.data)
    
    if data['action'] != 'created':
        return
    
    issue_id = data['data']['issue']['id']
    install_id = data['installation']['uuid']
    
    issue_details = get_sentry_issue(install_id, issue_id)
    
    if issue_details['project']['name'] != 'Backend':
        return
        
    event = data['data']['event']
    
    payload = {
        'user': 'pushover-user-key',
        'token': 'pushover-api-token',
        'message': event['message'][:1024],
        'title': event['message'][:250],
        'url': event['url'],
        'url_title': 'Issue Details',
        'priority': 0,
    }
    requests.post('https://api.pushover.net/1/messages.json', data=payload)

def get_sentry_issue(install_id, issue_id):
    access_token = retrieve_from_db(install_id)
    
    url = 'https://sentry.io/api/0/issues/{}/'.format(issue_id)
    headers = {'Authorization': 'Bearer {}'.format(access_token)}
    
    resp = requests.get(url, headers=headers)
    return resp.json()
```

## Refreshing Access Tokens

The Access Tokens you receive from Sentry expire after eight hours. To retrieve a new token, you'll make a request to the same Authorization endpoint as above, but with a slightly different request body.

```python
def refresh_token(install_id):
    url = u'http://sentry.io/api/0/sentry-app-installations/{}/authorizations/'
    url = url.format(install_id)
    
    refresh_token = retrieve_refresh_token_from_db(install_id)
    
    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': 'your-client-id',
        'client_secret': 'your-client-secret',
    }
    
    resp = requests.post(url, json=payload)
    data = resp.json()
    
    new_access_token = data['token']
    new_refresh_token = data['refreshToken']
    # ... Securely update the access_token and refresh_token in DB...
    
    return new_access_token
```

Instead of keeping track of times and passively refreshing at the time a token expires, one painless way you can handle refreshing tokens is to actively capture exceptions raised by requests that receive a `401 Unauthorized` response from Sentry, refresh the token, and remake the request. 

You can modify your `get_sentry_issue` function to do this:

```python
def get_sentry_issue(install_id, issue_id):
    access_token = retrieve_from_db(install_id)
    
    url = 'https://sentry.io/api/0/issues/{}/'.format(issue_id)
    headers = {'Authorization': 'Bearer {}'.format(access_token)}
    
    resp = requests.get(url, headers=headers)
    
    if resp.status_code == 401:
        new_access_token = refresh_token(install_id)
        headers['Authorization'] = u'Bearer {}'.format(new_access_token)
        resp = requests.get(url, headers=headers)
        
    return resp.json()
```

From here you can augment your `/webhook` endpoint to handle other events in the future, make requests to Sentry from elsewhere in your app, and implement the integrated features your customers most desire.

## UI Components

The Sentry Integration Platform provides the ability to add rich UI components to Sentry itself through a declarative syntax that requires zero code. 

Through a JSON-Schema based system, you can have Sentry render a way for Users to link Sentry Issues to Issues in your service or open a specific line of a stack trace in your tool. We'll be expanding the scope of what you can augment over time, as well.

```json
{
    "elements": [{
        "type": "stacktrace-link",
        "uri": "/debug",
    }]
}
```

For more information about UI Components, see [full documentation]({%- link _documentation/workflow/integrations/integration-platform/ui-components.md -%}).

## FAQ

#### How are Sentry Integrations different from Plugins?

Plugins (aka Legacy Integrations) are extensions of Sentry packaged as Python libraries. Plugins have been contributed both internally (for example, sentry-plugins) and externally by outside developers (for example, sentry-trello). Plugins are configured separately for each project.

{% include components/alert.html
  title="Note"
  content="Going forward, writing a Sentry Integration is the preferred method of integrating with Sentry."
  level="warning"
%}

#### How is the Sentry Integration different from OAuth Apps?

OAuth Applications allow an external developer to create an application which can authenticate as a Sentry user and take actions as the user within Sentry.

Sentry Integration apps are similar to OAuth apps, except Sentry Integration apps act as an independent entity. There is currently no way for Sentry Integration apps to act on behalf of a user.

#### How is the Sentry Integration different from Auth Tokens?

Auth tokens are personal access tokens a user can use to invoke APIs directly. Sentry Integration Apps do not represent a single user, but rather make requests as “itself."

#### We use the Sentry API internally at our company. Should we switch to the Sentry Integration Platform?

If you're looking for any of the new features below, we recommend you switch to the Sentry Integration Platform.

**Permissions**

OAuth apps and Auth Tokens allow you to access Sentry as a specific user in your Sentry org. This means:

- If this user leaves the org or their permissions change, the integration can break. A Sentry Integrations App, on the other hand, is a separate, independent entity with its own permissions.
- OAuth apps and Auth Tokens permit the user to access other Sentry organizations they belong to, so there is limited isolation.
- Actions taken in Sentry will connect to this user rather than the integration/app. For example, if your alerting integration automatically assigns issues to a teammate, it will appear in the history as “Alice assigned Bob issue XYZ” rather than “<Your Sentry Integration apps> assigned Bob issue XYZ.”

**Managing Subscriptions**

With Sentry Integration apps you can manage resource subscriptions in the UI, as opposed to the current state where you need to make API calls to create/update/delete/retrieve subscriptions. The latter is not only more cumbersome but also harder to keep track of and maintain visibility across your team.

**Scope**

Currently, resource subscriptions must be configured per-project, which is unnecessary overhead especially when adding/removing projects. With Sentry Integration apps, you’ll receive notifications for all projects in your organization.

**New Event Types**

Sentry Integration apps expose a richer set of events that are not available via the legacy service hooks API. Currently, this includes Issue Created, Issue Resolved, Issue Ignored, and Issue Assigned. In the future, we’ll add more types of webhooks to Sentry Integration apps.

**Custom UI Components**

Sentry Integration apps will be able to augment Sentry’s UI in meaningful and feature-rich ways. For example, on the issue page, you could have a button that creates a task in your task-management tool, or open a line in the stack trace in another tool.

#### How can I build an Integration with Sentry?

Email [partners@sentry.io](mailto:partners@sentry.io) to get started.
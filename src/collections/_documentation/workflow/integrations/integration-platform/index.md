---
title: Integration Platform
sidebar_order: 2
---

# Sentry Integration Platform

Sentry's Integration Platform provides a way for external services to interact with the Sentry SaaS service using the REST API and webhooks. Integrations utilizing this platform are first class actors within Sentry and begin in an unpublished state where the app is available for use in your organization. 

For differences between an Integration Platform Application and prior methods of integrating with Sentry, see the FAQ at the bottom of the page.

{% include components/alert.html
  title="Note"
  content="Going forward, writing a Sentry Integration is the preferred method of integrating with Sentry."
  level="warning"
%}

[](https://www.notion.so/6c5d5042c2b043469cadc3f994c05f75#5bdced772ff54b03a476ac4ae3dc761c)

## Configuration

The examples below demonstrate a potential use-case that involves a Flask app receiving new issue webhooks from Sentry, calling the Sentry API for more data about the issue, and pushing it to Pushover **[LINK to website]** as a generator of desktop/mobile notifications. 

### Creating an App

In Sentry, navigate to Organization Settings > Developer Settings > Create New Application.

[](https://www.notion.so/6c5d5042c2b043469cadc3f994c05f75#e73ed06454d1482eaa9e2bb79bb2a092)

### Permissions

Permissions ****specify what level of access your service requires of Sentry resources. Your application will prompt your user to approve of these permissions. For more information on Permissions, see full documentation **[LINK to docs]**.

[](https://www.notion.so/6c5d5042c2b043469cadc3f994c05f75#4154690bfd2141b1bfbff6ec6792cdc4)

### Event Subscriptions

Event subscriptions describe which webhooks are available for subscription. Currently, the only possible event subscription is new issue events. 

After selecting an Event Subscription, your application is in an unpublished state, where only the organization that "owns" it can install the application. Any member of the organization can create and modify the app.

[](https://www.notion.so/6c5d5042c2b043469cadc3f994c05f75#5ceb38a0513d4fea9a8a5e1fc8612b92)

## Building the App

After installation, if your user has approved of all permissions, Sentry will generate a grant code and an installation ID. If your application has a Redirect URL configured, the application redirects the user's browser to the configured URL with the grant code and Installation ID in the query params.

Start your build by implementing the Redirect URL endpoint, `/setup` — typically where you exchange the grant code for an access token that allows you to make API calls to Sentry. 

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

Next, implement the Webhook URL endpoint, `/webhook`, which receives new Issue Events. In this method, you'll use the Sentry API to check if the issue belongs to a project called Backend, and if it does, you'll forward the issue to Pushover.

    @app.route('/webhook', methods=['POST'])
    def webhook():
        data = json.loads(request.data)
        
        if data['action'] != 'issue.created':
            return
      
        issue_id = data['data']['id']
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

## Refreshing Access Tokens

The Access Tokens you receive from Sentry expire after eight hours. To retrieve a new token, you'll make a request to the same Authorization endpoint as above, but with a slightly different request body.

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

Instead of keeping track of times and passively refreshing at the time a token expires, one painless way you can handle refreshing tokens is to actively capture exceptions raised by requests that receive a `401 Unauthorized` response from Sentry, refresh the token, and remake the request. 

You can modify your `get_sentry_issue` function to do this:

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

From here you can augment your `/webhook` endpoint to handle other events in the future, make requests to Sentry from elsewhere in your app, and implemented the integrated features your customers most desire.

## UI Components

The Sentry Integration Platform provides the ability to add rich UI components to Sentry itself through a declarative syntax that requires zero code. 

Through a JSON-Schema based system, you can have Sentry render a way for Users to link Sentry Issues to Issues in your service or open a specific line of a stack trace in your tool. We'll be expanding the scope of what you can augment over time, as well.

    {
            "elements": [{
                    "type": "stacktrace-link",
                    "uri": "/debug",
            }]
    }

For more information about UI Augmentation, see full documentation **[LINK to UI Components doc]**.

## FAQ

### How are Sentry Integrations different from Plugins?

Plugins (aka Legacy Integrations) are extensions of Sentry packaged as Python libraries. Plugins have been contributed both internally (for example, sentry-plugins) and externally by outside developers (for example, sentry-trello). Plugins are configured separately for each project.

**[Alert Note:** Going forward, writing a Sentry Integration is the preferred method of integrating with Sentry.**]**

### How is the Sentry Integration different from OAuth Apps?

[OAuth Applications](https://sentry.io/settings/account/api/applications/) allow an external developer to create an application which can authenticate as a Sentry user and take actions as the user within Sentry.

Sentry Integration apps are similar to OAuth apps, except Sentry Integration apps act as an independent entity. There is currently no way for Sentry Integration apps to act on behalf of a user.

### How is the Sentry Integration different from Auth Tokens?

Auth tokens are personal access tokens a user can use to invoke APIs directly. Sentry Integration Apps do not represent a single user, but rather make requests as “itself."

### We use the Sentry API internally at our company. Should we switch to the Sentry Integration Platform?

If you're looking for any of the new features below, we recommend you switch to the Sentry Integration Platform.

**Permissions**
OAuth apps and Auth Tokens allow you to access Sentry as a specific user in your Sentry org. This means:

- If this user leaves the org or their permissions change, the integration can break. A Sentry Integrations App, on the other hand, is a separate, independent entity with its own permissions.
- OAuth apps and Auth Tokens permit the user to access other Sentry organizations they belong to, so there is limited isolation.
- Actions taken in Sentry will connect to this user rather than the integration/app. For example, if your alerting integration automatically assigns issues to a teammate, it will appear in the history as “Alice assigned Bob issue XYZ” rather than “<Your Sentry Integration apps> assigned Bob issue XYZ.”

**Managing Subscriptions**
With Sentry Integration apps you can manage event subscriptions in the UI, as opposed to the current state where you need to make API calls to create/update/delete/retrieve subscriptions. The latter is not only more cumbersome but also harder to keep track of and maintain visibility across your team.

**Scope**
Currently, event subscriptions must be configured per-project, which is unnecessary overhead especially when adding/removing projects. With Sentry Integration apps, you’ll receive notifications for all projects in your organization by default and can enable/disable them per-project.

**New Event Types**
Sentry Integration apps expose a richer set of events that are not available via the legacy service hooks API. Currently, this includes Issue Created, Issue Resolved, Issue Ignored, and Issue Assigned. In the future, we’ll add more types of notifications to Sentry Integration apps.

**Custom UI Components**
Sentry Integration apps will be able to augment Sentry’s UI in meaningful and feature-rich ways. For example, on the issue page, you could have a button that creates a task in your task-management tool, or a custom section that shows additional data related to the issue by calling an external API.

### How can I build an Integration with Sentry?

Email [partners@sentry.io](mailto:partners@sentry.io) to get started.
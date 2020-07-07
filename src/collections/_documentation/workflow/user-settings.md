---
title: User Settings
sidebar_order: 8
---
Manage your account details from the User Settings page, available in the dropdown menu under your organization’s name.

## Account Details

Sentry automatically saves all changes made in the Account Details section.

## Preferences

Unlike Account Details, the Preferences section doesn't automatically save all changes. Choose your changes in the provided dropdowns. 

### Stack Trace Order

Choose the order of stack trace frames; the default is "let Sentry decide".

{% asset user-settings/us-sto.png alt="Stack trace order field in Account Details under User Settings" width="617.5" %}

### Language

Use the dropdown to choose the default language.

{% asset user-settings/us-lang.png alt="Language field in Account Details under User Settings" width="221.5" %}

### Timezone

Choose the timezone to display on issue timestamps. For a 24-hour clock, slide the toggle.

{% asset user-settings/us-time.png alt="Timezone field in Account Details under User Settings" width="392" %}

### Avatar

Choose between displaying your initials, an image, or a Gravatar next to your name. To save your selection, click "Save Avatar".

{% asset user-settings/us-avatar.png alt="Avatar field in Account Details under User Settings" width="227.5" %}

# Security

Security contains two sections: Settings and Session History.

## Settings
### Password

As a reminder, changing your password invalidates all logged in sessions. For more details about changing passwords, check with your information technology (IT) department.

{% asset user-settings/us-pass.png alt="Password field in Security under User Settings" width="450" %}

### Sessions

Sessions end with each sign out. Clicking "Sign out of all devices" will end your sessions with all Sentry devices.

{% asset user-settings/us-sess.png alt="Sessions field in Security under User Settings" width="550" %}

### Two-Factor Authentication

Keep your account information secure by enabling a two-factor authentication method. Choose between an Authenticator App, Text Message, or a Universal 2nd Factor (U2F) hardware device.

{% asset user-settings/us-2fact.png alt="Two-Factor Authentication selection in Securty under User Settings" width="745" %}

### Recover Codes

If you cannot receive two-factor authentication codes, such as when you lose your device, use recovery codes to access your account. Click the "View Codes" button to download, print, or copy your codes to a secure location.

{% asset user-settings/us-rec.png alt="Recover codes field in Security under User Settings" width="673" %}

### Session History

Find a historical list of your sessions, including First Seen and Last Seen timestamps, under the Session History tab.

{% asset user-settings/us-shistory.png alt="Session History tab in Security under User Settings" width="380" %}

# Notifications

Sentry notifications are broadly categorized into alerts and non-alert notifications. 

- Alerts can be sent to many supported [integrations](/workflow/integrations/#webhook-alerts). 
- Non-alert notifications only go to email.

## Alerts & Notifications

Define Project Alerts in [Project] > Project Settings > Alerts. Slide the toggle under Send Me Alerts to receive team alerts. Fine-tune the alerts you receive per project with the dropdown selector.

Control workflow notifications (for example, in issue assignment, resolution status, and comments) by clicking a radio button under Send Me Workflow Notifications. Fine-tune workflow notifications per project with the dropdown selector.

For more details, see the [full documentation on Alerts & Notifications](/workflow/alerts-notifications/).

## Email Routing

Email notifications default to the email address used to set up your Sentry account. Route email notifications to an alternative email address and keep your project notifications organized. For example, infrastructure-related projects can route to an email dedicated to your team's infrastructure.

{% asset user-settings/us-eroute.png alt="Email Routing field in Notifications under User Settings" width="450" %}

## Weekly Reports

Sentry generates reports per project and sends them once a week on Mondays. Fine-tune your reports per project with the dropdown selector.

{% asset user-settings/us-wrfield.png alt="Weekly Reports field in Notifications under User Settings" width="450" %}

The following report sample shows details on Events Seen This Week, Events by Issue Type, Events by Project, and activity over time.

{% asset user-settings/us-ereport.png alt="Weekly Report email sample" width="745" %}

## Deploy Notifications

Choose a Deploy Notifications option to keep track of deployment details such as release version, environments, and commit reviews. Fine-tune options from the dropdown next to each organization.

{% asset user-settings/us-deploy.png alt="Deploy Notifications selection in Notifications under User Settings" width="673" %}

## My Activity

Updates regarding your user account actions, such as claiming unassigned issues, can be turned into an email notification in this section.

{% asset user-settings/us-myact.png alt="My Activity selection in Notifications under User Settings" width="450" %}

{% capture __alert_content -%}
Find a shortcut to the Emails panel at the bottom of this section.

{% asset user-settings/us-npanellink.png alt="A link to the Email panel in Notifications under My Activity" width="465" %}

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
%}

## Emails

The email address used to login to your Sentry account is by default your primary email address. Add an alternative email address under the Add Secondary Emails section.

{% asset user-settings/us-eprime.png alt="Primary email field in Emails under User Settings" width="494" %}

{% capture __alert_content -%}

Find a shortcut to the Notifications panel at the bottom of this section.

{% asset user-settings/us-epanellink.png alt="A link to the Notifications panel in Emails under Additional Email" width="450" %} 

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
%}

## Subscriptions

As part of our compliance with the EU’s General Data Protection Regulation (GDPR), you receive marketing campaign emails only after explicitly opting into any of the listed categories.

{% asset user-settings/us-subs.png alt="Subscriptions section under User Settings" width="450" %}

## Authorized Applications

Sentry lists all authorized third-party applications in this section and requires authentication tokens for authorization. Find tokens in the [*Auth Tokens*](https://sentry.io/api/) section. 

## Identities

Sentry integrates with several identity providers, like Okta, OneLogin, Auth0, and Yubico. To disconnect any previously configured provider, click the "Disconnect" button.

{% asset user-settings/us-id.png alt="Disconnect button in Identities section under User Settings" %}

## Close Account

Closing your Sentry account automatically removes all data associated with your account. If your account is the sole owner of an organization, this organization will be deleted. Organizations with multiple owners will remain unchanged.

{% asset user-settings/us-close.png alt="Close Account button in Close Account section under User Settings" width="745" %}

{% capture __alert_content -%}

Deleting your account cannot be undone. 

{%- endcapture -%}
{%- include components/alert.html
    title="Warning"
    content=__alert_content
    level="warning"
%}

## API

### Applications

Integrating your application with Sentry allows you to send events to your Sentry instance automatically. To create an application, click the "Create New Application" button.

{% asset user-settings/us-apps.png alt="Create New Application button in the Applications section under User Settings" width="380" %}

### Auth Tokens

Authentication tokens allow you to perform actions against the Sentry API on behalf of your account. To create one, click the "Create New Token" button.

{% asset user-settings/us-token.png alt="Create New Token button in the Auth Tokens section under User Settings" width="745" %}

---
title: 'Require 2FA'
sidebar_order: 3
---

For an added layer of security, you can require your organization members to sign in to Sentry with two-factor authentication (2FA).

## Preface

{% capture __alert_content -%}
Sentry owner permissions are required to enforce two-factor authentication across your organization.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. Before you can require organization members to use 2FA, you must [enable two-factor authentication](https://sentry.io/settings/account/security/) for your own user account.
1. We recommend notifying your organization members, and asking them to setup 2FA for their accounts before requiring two-factor authentication. You can see which members are enrolled on your organization's members page.

    [{% asset require-2fa-members.png %}]({% asset require-2fa-members.png @path %})
    
## Setup Require 2FA

{% capture __alert_content -%}
When you require two-factor authentication, members who are not enrolled in 2FA will be removed from your organization. They will lose access to your organization's projects and notifications, and will be sent an email to setup 2FA. They can reinstate their access and settings within three months of their removal from your organization.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

1. Go to **Organization Settings** >> General Settings.
1. Under Security & Privacy, toggle the **Require Two-Factor Authentication** switch.
        
    [{% asset require-2fa-switch.png %}]({% asset require-2fa-switch.png @path %})
        
1. Click **Confirm**.

## View Removed Members

To view members who were removed from your organization for 2FA non-compliance, you can look at your organization's audit log.

1. Go to **Organization Settings** >> Audit Log.

    [{% asset require-2fa-audit-log.png %}]({% asset require-2fa-audit-log.png @path %})

1. You can filter for action **member.pending** to see removed organization members, and action **org.edit** to see when the require_2fa organization setting was changed.

## Require 2FA and SSO

Require 2FA is currently not available with Single Sign-On (SSO), so you would need to require two-factor authentication with your identity provider.

## Steps to Rejoin an Organization

{% capture __alert_content -%}
To reinstate your access and previous settings, you need to setup 2FA within three months of being removed from your organization.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

If you were removed from an organization due to 2FA non-compliance, follow these steps to rejoin the organization and reinstate your access and settings:

1. Look in your inbox for an email from Sentry titled **Mandatory: Enable Two-Factor Authentication**.

    [{% asset require-2fa-email.png %}]({% asset require-2fa-email.png @path %})

1. Click the **Enable Two-Factor Authentication** button. 
1. If you can't find the email, ask an organization Owner or Manager to go to the **Organization Settings** >> Members page and resend your invite.

    [{% asset require-2fa-resend-invite.png %}]({% asset require-2fa-resend-invite.png @path %})
    
1. After clicking through the email, you will be prompted to **Setup Two-Factor Authentication** before rejoining the organization.

    [{% asset require-2fa-rejoin.png %}]({% asset require-2fa-rejoin.png @path %})
    
1. This will take you to your **Account Settings** >> [Security](https://sentry.io/settings/account/security/) page where you need to setup at least one form of two-factor authentication.

    [{% asset require-2fa-add-auth.png %}]({% asset require-2fa-add-auth.png @path %})
    
1. Once you've enrolled in 2FA, remember to save your recovery codes in a safe place and consider adding a backup phone number.
1. Then use the left sidebar to navigate to your organization.
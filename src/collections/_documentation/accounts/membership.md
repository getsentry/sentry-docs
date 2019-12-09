---
title: Organization Management
sidebar_order: 1
---

## Membership

User membership in Sentry is handled at the organizational level. The system is
designed so each user has a singular account which can be reused across
multiple organizations (even those using SSO). Each user of Sentry should have
their own account, and will then be able to set their personal preferences
in addition to receiving notifications for events.

### Roles

Access to organizations is dictated by roles. Your role is scoped to an entire organization.

Roles include:

: -   Owner
  -   Manager
  -   Admin
  -   Member
  -   Billing

| Action | Billing | Member | Admin | Manager | Owner |
| --- | --- | --- | --- | --- | --- |
| Can see/edit billing information and subscription details | X |   |   |   | X |
| Can view and act on issues, such as assigning/resolving/etc. |   | X | X | X | X |
| Can join and leave teams. |   | X | X | X | X |
| Can change Project Settings |   |   | X | X | X |
| Can add/remove projects* |   |   | X | X | X |
| Can edit Global Integrations |   |   | X | X | X |
| Can add/remove/change members |   |   |   | X | X |
| Can add/remove teams* |   |   | X | X | X |
| Can add Repositories |   |   | X | X | X |
| Can delete Repositories |   |   |   |   | X |
| Can change Organization Settings |   |   |   | X | X |
| Can remove an Organization |   |   |   |   | X |

\* Admins can only remove teams and projects they're a member of (or all teams, if open membership is on).

### Restricting Access

-   Access to Organizations is dictated by Roles, which is scoped to an entire Organization.
-   Access to a Project is limited to the Team that owns the project. However, any Member, Admin, Manager or Owner can join a Team.
-   If you want to further restrict access to a Project, you can control access to Teams by making them accessible only through invitation by a Manager or Owner.

To restrict Team access, go to Organization Settings and flip the “Open Membership” toggle.

{% asset membership-toggle.png %}

## Transferring a project

To transfer a project go to the target project's Project Settings >> General
Settings >> Transfer Project. Enter the email of the organization's owner you
wish to transfer it to, and they'll receive an email to approve the transfer.
When the project is transferred to the new organization, it's recommended to
add it to a team for better visibility.

## Removing an Organization

It is possible to remove an organization and all associated
organization data completely. Doing so will *not* remove user accounts, but will remove
their membership in the organization.

To remove an organization visit the Organizations General Settings and locate
the "Remove Organization" panel. Clicking the "Remove Organization" button will
prompt you for confirmation. After removing an organization, it will be queued
for deletion.

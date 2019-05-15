---
title: Membership
sidebar_order: 1
---

Membership in Sentry is handled at the organizational level. The system is designed so each user has a singular account which can be reused across multiple organizations (even those using SSO). Each user of Sentry should have their own account, and will then be able to set their own personal preferences in addition to receiving notifications for events.

## Roles

Access to organizations is dictated by roles. Your role is scoped to an entire organization.

Roles include:

: -   Organization Owner
  -   Manager
  -   Admin
  -   Member
  -   Billing

| Action | Billing | Member | Admin | Manager | Organization Owner |
| --- | --- | --- | --- | --- | --- |
| Can see/edit billing information and subscription details | X |   |   |   | X |
| Can view and act on issues, such as assigning/resolving/etc. |   | X | X | X | X |
| Can join and leave teams |   | X | X | X | X |
| Can change project settings |   |   | X | X | X |
| Can add/remove projects* |   |   | X | X | X |
| Can edit global integrations |   |   | X | X | X |
| Can add/remove/change members |   |   |   | X | X |
| Can add/remove teams* |   |   | X | X | X |
| Can add repositories |   |   | X | X | X |
| Can delete repositories |   |   |   |   | X |
| Can change organization settings |   |   |   | X | X |
| Can remove an organization |   |   |   |   | X |

\* Admins can only remove teams and projects they're a member of (identical to manager if open membership is on).

## Restricting Access

Access to a project is limited to the team that owns the project. However, any member, admin, manager or organization owner can join a team. If you want to further restrict access to a project, you can control access to teams by making them accessible only through invitation by a manager or organization owner.

To restrict team access, go to Organization Settings and flip the “Open Membership” toggle.

{% asset membership-toggle.png %}

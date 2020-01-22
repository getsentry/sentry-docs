---
title: Organization Management
sidebar_order: 1
---

# Membership

User membership in Sentry is handled at the organizational level.
The system is designed so each user has a single Sentry account,
which can then join one or more organizations. Each user should have
their own account, where they can manage their personal preferences,
including notification and security settings.

## Roles

Member roles dictate access within an organization.

### Owner
 - Unrestricted access to the organization, its data, and settings.
 - Can add, modify, and delete projects and members, as well as make billing and plan changes.
 - Can delete an organization.

### Manager
 - Gains admin access on all teams.
 - Can add and remove members from the organization.

### Admin
 - Admin access only on teams they're a member of. 
 - Can create new teams and projects, as well as remove teams and projects they're a member of.

### Member
 - Can view and act on events, as well as view most other data within the organization.

### Billing
 - Can manage subscription and billing details.

## Open Membership

Open membership is enabled by default, which allows members to join, leave, and add other members to teams.

## Restricting Access

- Access to a Project is limited to the Team that owns the project. However, with open membership,
members can join and add members to teams.
- To further restrict access to a Project, you can control access to Teams by making them accessible
only through invitation by a Manager, Owner, or Team Admin.

To restrict Team access, go to Organization Settings and flip the “Open Membership” toggle.

{% asset membership-toggle.png %}

# Transferring a project

To transfer a project go to the target project's Project Settings >> General
Settings >> Transfer Project. Enter the email of the organization's owner you
wish to transfer it to, and they'll receive an email to approve the transfer.
When the project is transferred to the new organization, it's recommended to
add it to a team for better visibility.

# Removing an Organization

It is possible to remove an organization and all associated
organization data completely. Doing so will *not* remove user accounts, but will remove
their membership in the organization.

To remove an organization visit the Organizations General Settings and locate
the "Remove Organization" panel. Clicking the "Remove Organization" button will
prompt you for confirmation. After removing an organization, it will be queued
for deletion.

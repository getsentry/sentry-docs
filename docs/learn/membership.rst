Membership
==========

Membership in Sentry is handled at the organizational level. The system is designed so each user has a singular account which can be reused across multiple organizations (even those using SSO). Each user of Sentry should have their own account, and will then be able to set their own personal preferences in addition to receiving notifications for events.

Roles
-----

Access to organizations is dictated by roles. Your role is scoped to an entire organization.

Roles include:
   * Owner
   * Manager
   * Admin
   * Member
   * Billing

+------------+--------------------+------------------------------+
|     Action                      |  Allowed Roles               |
+=================================+==============================+
| Can see/edit billing information| Billing, Manager, Owner      |
| and subscription details        |                              |
+---------------------------------+-----------+------------------+
| Can view and act on issues, such| Admin, Member, Manager, Owner|
| as assigning/resolving/etc.     |                              |
+---------------------------------+-----------+------------------+
| Can join and leave teams.       | Admin, Member, Manager, Owner|
+---------------------------------+-----------+------------------+
| Can add/remove/change members   | Manager, Owner               |
+---------------------------------+-----------+------------------+
| Can change Project Settings     | Admin, Manager, Owner        |
+---------------------------------+-----------+------------------+
| Can add Repositories            | Manager, Owner               |
+---------------------------------+-----------+------------------+
| Can change Organization Settings| Manager, Owner               |
+---------------------------------+-----------+------------------+
| Can remove an Organization      | Owner                        |
+---------------------------------+-----------+------------------+

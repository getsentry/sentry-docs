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

+------------+--------------------+---------+--------+--------+---------+---------+
|     Action                      | Billing | Member | Admin  | Manager |  Owner  |
+=================================+=========+========+========+=========+=========+
| Can see/edit billing information|    X    |        |        |         |    X    |
| and subscription details        |         |        |        |         |         |
+---------------------------------+---------+--------+--------+---------+---------+
| Can view and act on issues, such|         |   X    |   X    |    X    |    X    |
| as assigning/resolving/etc.     |         |        |        |         |         |
+---------------------------------+---------+--------+--------+---------+---------+
| Can join and leave teams.       |         |   X    |   X    |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can change Project Settings     |         |        |   X    |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can add/remove projects         |         |        |   X    |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can edit Global Integrations    |         |        |    X   |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can add/remove/change members   |         |        |        |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can add/remove teams            |         |        |        |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can add Repositories            |         |        |        |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can change Organization Settings|         |        |        |    X    |    X    |
+---------------------------------+---------+--------+--------+---------+---------+
| Can remove an Organization      |         |        |        |         |    X    |
+---------------------------------+---------+--------+--------+---------+---------+

Restricting Access
------------------

* Access to Organizations is dictated by Roles, which is scoped to an entire Organization.
* Access to a Project is limited to the Team that owns the project. However, any Member, Admin, Manager or Owner can join a Team.
* If you want to further restrict access to a Project, you can control access to Teams by making them accessible only through invitation by a Member or Owner.

To restrict Team access, go to Organization Settings and flip the “Open Membership” toggle.

.. image:: img/membership-toggle.png


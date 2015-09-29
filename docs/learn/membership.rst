Membership
==========

Membership is managed at the organizational level and is based on the type of access (the role) and the scope of access (teams or global)

Roles
-----

The general rules for access roles are as follows:

**Member:**
  General read access (such as being able to view events). Gets ``*:read`` permission.

**Admin:**
  Can manage settings as well as create projects (or teams, if they're scoped to the organization). Gets ``*:write`` permission.

**Owner:**
  Can perform severe/catastrophic operations (such as deleting the organization). Gets ``*:delete`` permission.

The scoping of the membership dictates what kind of access the role is applied to.

Scoping
-------

Scoping is based on the selection of teams (team-level scoping) or if the
membership is selected to apply across all teams (org-level scoping).

When the membership is applied globally, that is the "has access to all teams" attribute is selected,
the member will gain significantly elevated privileges. For example, an admin that has global access
can invite new members, whereas an admin that only has access to a single team cannot manage membership
at all.

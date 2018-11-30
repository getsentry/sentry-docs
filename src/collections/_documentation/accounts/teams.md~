---
title: Teams
sidebar_order: 2
---

Teams are a workflow feature in Sentry used to denote two things in Sentry: access, and
structure. They are used to reflect the various departments and initiatives within a company's engineering organization.

## Team Hierarchy

From an organizational standpoint, teams in Sentry can be used to as a means to display relevant projects to the engineers who directly work on them.

{% asset team-list-example.png %}

In the above example, 8 different teams are represented within the company organization. That’s only half the story, however, as these different teams can share access with one another across various projects.

{% asset team-project-access.png %}

Teams and projects within Sentry share a many-to-many relationship. For instance, a `shopCreator` project may be simultaneously accessed by `#qa`, `#backend`, and `#api` teams because all three groups work on the same application together.

{% asset team-with-projects.png %}

Similarly, the `#backend` team may have access to `shopCreator` and `checkoutCart` projects because the exceptions raised by this application may be valuable for both of them.


## Team Access

By default, all teams within a Sentry organization are Closed Memberships, meaning that members must manually be assigned to teams by an Admin.  It’s possible to change this setting in your Organization Settings by going to _Organization Settings > Open Membership_

[screenshot for due diligence]

After applying the changes, members within your organization will be able to self-select into team memberships of their own choosing.

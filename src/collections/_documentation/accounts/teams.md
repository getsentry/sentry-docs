---
title: Teams
sidebar_order: 2
---

Teams are a workflow feature in Sentry that reflect the various departments and initiatives within a company's engineering organization. They are used to denote two things: access, and
structure. By leveraging teams, an organization can introduce a sense of hierarchy, and route engineering groups directly to the projects that they work on.

{% asset team-list-example.png %}

In the above example, 8 different teams are represented within the company organization. That’s only half the story, however, as these different teams can share access with one another across various projects.

{% asset team-project-access.png %}

Teams and projects within Sentry share a many-to-many relationship. For instance, a `shopCreator` project may be simultaneously accessed by `#qa`, `#backend`, and `#api` teams because all three groups work on the same application together.

{% asset team-with-projects.png %}

Similarly, the `#backend` team may have access to `shopCreator` and `checkoutCart` projects because the exceptions raised by this application may be valuable for both of them.

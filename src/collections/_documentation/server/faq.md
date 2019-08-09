---
title: 'Frequently Asked Questions'
sidebar_order: 22
---

This document covers some frequently asked questions that come up.

**Sentry shows _Bad Request (400)_ when loading the web UI.**

> Your **system.url-prefix** setting is wrong. See [_Configuring Sentry_]({%- link _documentation/server/config.md -%}) for more information.

**My sentry is running at _example.com:9000_ but whenever I visit it I get redirected to _example.com_.**

> You likely have not correctly configured **system.url-prefix**. See [_Configuring Sentry_]({%- link _documentation/server/config.md -%}) for more information.

**AJAX requests do not seem to work properly.**

> It’s likely you have not correctly configured **system.url-prefix**, so you’re hitting CORS issues. See [_Configuring Sentry_]({%- link _documentation/server/config.md -%}) for more information.

**The client reports success (200 OK) but I don’t see events**

> Something is misconfigured. A 200 OK from the API means “I have validated and enqueued this event”, so the first thing you should check is your workers.

**Counts on events aren’t increasing.**

> Counts are incremented in bulk asynchronously utilizing the buffer and queue subsystems. Check your configuration on those. Also make sure that you have the workers and cron running.

**How do I script the Sentry installation to bootstrap things like projects and users?**

> Sentry is a simple Django (Python) application that runs using a utility runner. A script that creates a project and default user might look something like this:
> 
> ```python
> # Bootstrap the Sentry environment
> from sentry.utils.runner import configure
> configure()
> 
> # Do something crazy
> from sentry.models import (
>     Team, Project, ProjectKey, User, Organization, OrganizationMember,
>     OrganizationMemberTeam
> )
> 
> organization = Organization()
> organization.name = 'MyOrg'
> organization.save()
> 
> team = Team()
> team.name = 'Sentry'
> team.organization = organization
> team.save()
> 
> project = Project()
> project.team = team
> project.add_team(team)
> project.name = 'Default'
> project.organization = organization
> project.save()
> 
> user = User()
> user.username = 'admin'
> user.email = 'admin@localhost'
> user.is_superuser = True
> user.set_password('admin')
> user.save()
> 
> member = OrganizationMember.objects.create(
>     organization=organization,
>     user=user,
>     role='owner',
> )
> 
> OrganizationMemberTeam.objects.create(
>     organizationmember=member,
>     team=team,
> )
> 
> key = ProjectKey.objects.filter(project=project)[0]
> print 'SENTRY_DSN = "%s"' % (key.get_dsn(),)
> ```

**Is MySQL (or any database besides PostgreSQL) supported?**

> Sentry does not support any database besides PostgreSQL. While, for historical reasons, some things may function, choosing to operate Sentry with an unsupported database will result in the Sentry team being unable to provide support, and will result in support tickets and issues posted to the public tracker being closed as ‘wontfix’
> 
> At a future time Sentry will be removing support entirely for any non-standard databases.

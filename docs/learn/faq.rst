FAQ
===

**Q**: :ref:`faq-1`

**Q**: :ref:`faq-2`

**Q**: :ref:`faq-3`

**Q**: :ref:`faq-4`

**Q**: :ref:`faq-5`



.. _faq-1:

Why am I still receiving notification and alert emails?
-------------------------------------------------------

**A**: In the body of each email you will see the specific reason you are receiving that email.

.. image:: /../design/images/faq1-1.png

Select **Unsubscribe** to stop receiving emails for this issue.

You will automatically be subscribed to an issue when taking one of the following actions:

*  Assignment

*  Comments

*  Regressions

*  Resolution

You can find which issues you are assigned to by searching ``subscribed:me``.
Then you can unsubscribe from a particular issue by selecting that issue and
clicking the **Unsubscribe** button.

.. image:: /../design/images/faq1-2.png

.. _faq-2:

I accidentally merged issues together, can I unmerge?
-----------------------------------------------------

**A**: No. Merging is a permanent action. However, you can delete the merged
issue and the future events will be grouped together how they originally would
be.

.. _faq-3:

I want to search all events with a certain tag. How come when I select an issue, the event shows a different value for that tag?
--------------------------------------------------------------------------------------------------------------------------------

**A**: If you are searching by tag within a certain project, you will get issues that contain at least one event with that given tag.
If you select a particular issue, you can search after selecting the "Related Events" tab to find the exact events with the tag you are
searching for.

**Example:**

Desired tag: release:97eaa54

  .. image:: /../design/images/faq3-1.png


Selecting an issue [the first one for example] shows you the most recent event for that issue. Selecting "Related Events" will give you all the events for that particular issue

  .. image:: /../design/images/faq3-2.png


Searching under "Related Events" gives you specific events with the desired tag

  .. image:: /../design/images/faq3-3.png



.. _faq-4:

I’m seeing [Filtered] data, what is causing that?
-------------------------------------------------

**A**: This is because you have Data Scrubbers enabled.

.. image:: /../design/images/faq4.png

Data Scrubbers can operate at both an **organization** level and a **project** level.
This is option can be found at ``https://sentry.io/organizations/{organization}/settings/`` and
at ``https://sentry.io/organizations/{organization_slug}/{project_slug}/settings/``.

If you have Data Scrubbers enabled on the organization level, they are applied to *every* project.

See `Sensitive Data <https://docs.sentry.io/learn/sensitive-data>`__ for more detailed information

.. _faq-5:

How come when I search for additional data information, I don't see any results?
--------------------------------------------------------------------------------

**A**: Additional data such as User Context or Extra Context is not indexed. This information
must be included as a Tag.

However, for User Context, Sentry provides four field names that are already indexed, and therefore
searchable if the information is provided:

  .. describe:: id
  .. describe:: username
  .. describe:: email
  .. describe:: ip


See `Context <https://docs.sentry.io/learn/context/#context>`__ for more detailed information

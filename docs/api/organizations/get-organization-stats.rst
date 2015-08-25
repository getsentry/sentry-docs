.. this file is auto generated. do not edit

Retrieve Event Counts for an Organization
=========================================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/organizations/{organization_slug}/stats/``
Method:
 ``GET``

**Draft:** This endpoint may change in the future without notice.

Return a set of points representing a normalized timestamp and the
number of events seen in the period.

Query ranges are limited to Sentry's configured time-series
resolutions.

Parameters:

- ``since``: a timestamp to set the start of the query
- ``until``: a timestamp to set the end of the query
- ``resolution``: an explicit resolution to search for (i.e. 10s)
- ``stat``: the name of the stat to query (received, rejected)

**Note:** resolution should not be used unless you're familiar
with Sentry internals as it's restricted to pre-defined values.

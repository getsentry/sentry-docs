.. this file is auto generated. do not edit

List a Project's Aggregates
===========================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/groups/``
Method:
 ``GET``

Return a list of aggregates bound to a project.

A default query of 'is:resolved' is applied. To return results
with other statuses send an new query value (i.e. ?query= for all
results).

Any standard Sentry structured search query can be passed via the
``query`` parameter.

The ``statsPeriod`` parameter can be used to select the timeline
stats which should be present. Possible values are: '' (disable),
'24h', '14d'

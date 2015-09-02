.. this file is auto generated. do not edit

Upload a New File
=================

.. sentry:api-endpoint:: post-release-files

    Upload a new file for the given release.

    Unlike other API requests, files must be uploaded using the
    traditional multipart/form-data content-type.

    The optional 'name' attribute should reflect the absolute path
    that this file will be referenced as. For example, in the case of
    JavaScript you might specify the full web URI.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to change the
                                 release of.
    :pparam string version: the version identifier of the release.
    :param string name: the name (full path) of the file.
    :param file file: the multipart encoded file.
    :param string header: this parameter can be supplied multiple times
                          to attach headers to the file.  Each header
                          is a string in the format ``key:value``.  For
                          instance it can be used to define a content
                          type.
    :auth: required

    :http-method: POST
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/

Example
-------


.. sentry:api-scenario:: UploadReleaseFile

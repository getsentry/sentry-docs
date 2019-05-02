---
title: 'File Storage'
sidebar_order: 5
---

Sentry provides an abstraction called ‘filestore’ which is used for storing files (such as release artifacts).

The default backend stores files on the local disk in `/tmp/sentry-files` which is not suitable for production use.

## File System Backend

```yaml
filestore.backend: 'filesystem'
filestore.options:
  location: '/tmp/sentry-files'
```

## Google Cloud Storage Backend

In addition to the configuration below, you’ll need to make sure the shell environment has the variable `GOOGLE_APPLICATION_CREDENTIALS` set. For more information, refer to the [Google Cloud documentation for setting up authentication](https://cloud.google.com/storage/docs/reference/libraries#setting_up_authentication).

```yaml
filestore.backend: 'gcs'
filestore.options:
  bucket_name: '...'
```

## Amazon S3 Backend

```yaml
filestore.backend: 's3'
filestore.options:
  bucket_name: '...'
```

* Sentry uses the [boto3](https://pypi.org/project/boto3/) library to access S3. Boto supports a number of ways to [retrieve configuration information](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#guide-configuration) including EC2/ECS IAM roles (recommended), the environment, its own configuration files, and you may also specify specify  `access_key` and `secret_key` values in your Sentry `filestore.options`:

    ```yaml
    filestore.backend: 's3'
    filestore.options:
        bucket_name: '...'
        access_key: '...'
        secret_key: '...'
    ```

* By default, S3 objects are created with the `public-read` ACL which means that the account used must have the `PutObjectAcl` permission in addition to `PutObject`, along with `GetObject` and `DeleteObject`. If you don't want your uploaded files to be publically-accessible you can specify the default ACL using a value accepted by [boto's S3 `put_object` method](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.put_object):

    ```yaml
    filestore.backend: 's3'
    filestore.options:
        bucket_name: '...'
        default_acl: 'private'
    ```

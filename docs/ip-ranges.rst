.. _ip-ranges:

IP Ranges
=========

In some circumstances the Hosted Sentry infrastructure might send HTTP
requests your way.  Primarily this is relevant to
:doc:`JavaScript Source Maps <../../clients/javascript/sourcemaps>`, but
also affects things like webhooks and other integrations.

Sentry uses the following IP addresses to make outbound requests::

    35.184.238.160/32
    104.155.159.182/32
    104.155.149.19/32
    130.211.230.102/32

Whitelisting Access via Nginx
-----------------------------

To whitelist access to source maps with Nginx for instance, you can use
this location example.  This example assumes your sourcemaps live in
``/static/dist``::

    location ~ ^/static/dist/(.+)\.map$ {
        alias /your/path/site/static/dist/$1.map;

        allow 35.184.238.160/32;
        allow 104.155.159.182/32;
        allow 104.155.149.19/32;
        allow 130.211.230.102/32;
        deny all;
    }

Whitelisting Access via Apache
------------------------------

To whitelist access to source maps with Apache you can use this example.
It can either go into your `.htaccess` or global config.  This example
assumes your sourcemaps live in ``/static/dist``:

.. sourcecode:: apache

    <FilesMatch "\.map$">
        Order deny,allow
        Deny from all
        Allow from 35.184.238.160/32
        Allow from 104.155.159.182/32
        Allow from 104.155.149.19/32
        Allow from 130.211.230.102/32
    </FilesMatch>

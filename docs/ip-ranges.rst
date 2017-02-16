.. _ip-ranges:

IP Ranges
=========

In some circumstances the Hosted Sentry infrastructure might send HTTP
requests your way.  Primarily this is relevant to
:doc:`JavaScript Source Maps <../../clients/javascript/sourcemaps>`, but
also affects things like webhooks and other integrations.

At this time Sentry does not provide an outbound proxy, so any of the public
subnets used by our workers may make outbound requests. The follow is a list
of the subnets usable by those machines::

    67.228.181.160/27
    67.228.250.96/29
    74.86.162.160/27
    75.126.189.224/28
    108.168.156.192/28
    108.168.248.64/28
    169.45.2.128/27
    169.45.178.64/27
    169.53.228.176/28
    173.193.138.208/28
    173.193.154.224/27
    208.101.49.96/27

Whitelisting Access via Nginx
-----------------------------

To whitelist access to source maps with Nginx for instance, you can use
this location example.  This example assumes your sourcemaps live in
``/static/dist``::

    location ~ ^/static/dist/(.+)\.map$ {
        alias /your/path/site/static/dist/$1.map;

        allow 67.228.181.160/27;
        allow 67.228.250.96/29;
        allow 74.86.162.160/27;
        allow 75.126.189.224/28;
        allow 108.168.156.192/28;
        allow 108.168.248.64/28;
        allow 169.45.2.128/27;
        allow 169.45.178.64/27;
        allow 169.53.228.176/28;
        allow 173.193.138.208/28;
        allow 173.193.154.224/27;
        allow 208.101.49.96/27;
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
        Allow from 67.228.181.160/27
        Allow from 67.228.250.96/29
        Allow from 74.86.162.160/27
        Allow from 75.126.189.224/28
        Allow from 108.168.156.192/28
        Allow from 108.168.248.64/28
        Allow from 169.45.2.128/27
        Allow from 169.45.178.64/27
        Allow from 169.53.228.176/28
        Allow from 173.193.138.208/28
        Allow from 173.193.154.224/27
        Allow from 208.101.49.96/27
    </FilesMatch>

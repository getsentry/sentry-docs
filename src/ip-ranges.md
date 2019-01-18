---
title: 'IP Ranges'
---

Sentry is served from a single IP address for all web traffic and all event accepting. The IP address is:

```python
35.188.42.15/32
```

In some circumstances the Hosted Sentry infrastructure might send HTTP requests your way. Primarily this is relevant to [_JavaScript Source Maps_]({%- link _documentation/clients/javascript/sourcemaps.md -%}), but also affects things like webhooks and other integrations.

Sentry uses the following IP addresses to make outbound requests:

```python
35.184.238.160/32
104.155.159.182/32
104.155.149.19/32
130.211.230.102/32
```

## Whitelisting Access via Nginx

To whitelist access to source maps with Nginx for instance, you can use this location example. This example assumes your source maps live in `/static/dist`:

```python
location ~ ^/static/dist/(.+)\.map$ {
    alias /your/path/site/static/dist/$1.map;

    allow 35.184.238.160/32;
    allow 104.155.159.182/32;
    allow 104.155.149.19/32;
    allow 130.211.230.102/32;
    deny all;
}
```

## Whitelisting Access via Apache

To whitelist access to source maps with Apache you can use this example. It can either go into your _.htaccess_ or global config. This example assumes your source maps live in `/static/dist`:

```apache
<FilesMatch "\.map$">
    Order deny,allow
    Deny from all
    Allow from 35.184.238.160/32
    Allow from 104.155.159.182/32
    Allow from 104.155.149.19/32
    Allow from 130.211.230.102/32
</FilesMatch>
```

## Email Delivery

All email is delivered from [SendGrid](https://sendgrid.com/) from the following static IP addresses:

```python
167.89.86.73
167.89.84.75
167.89.84.14
```

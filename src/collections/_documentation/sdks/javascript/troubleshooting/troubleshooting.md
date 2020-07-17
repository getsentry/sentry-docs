---
title: Troubleshooting
excerpt: ""
---

{%- capture __troubleshooting-content -%}
## Max JSON Payload Size

`maxValueLength` has a default value of 250, but you can adjust this value according to your needs if your messages are longer. Please note that not every single value is affected by this option.

## CORS Attributes and Headers
To gain visibility into a JavaScript exception thrown from scripts originating from different origins, do two things:

1. Add a crossorigin=”anonymous” script attribute

```bash
 <script src="http://another-domain.com/app.js" crossorigin="anonymous"></script>
 ```
The script attribute tells the browser to fetch the target file “anonymously.” Potentially user-identifying information like cookies or HTTP credentials won’t be transmitted by the browser to the server when requesting this file.

2. Add a Cross-Origin HTTP header

 ```bash
 Access-Control-Allow-Origin: *
 ```
 
Cross-Origin Resource Sharing (CORS) is a set of APIs (mostly HTTP headers) that dictate how files ought to be downloaded and served across origins.

By setting `Access-Control-Allow-Origin: *`, the server is indicating to browsers that any origin can fetch this file. Alternatively, you can restrict it to a known origin you control:

```bash
 Access-Control-Allow-Origin: https://www.example.com
 ```
 
Most community CDNs properly set an `Access-Control-Allow-Origin` header.

```bash
 $ curl --head https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js | \
 grep -i "access-control-allow-origin"

 Access-Control-Allow-Origin: *
 ```

## instrument.js Line Numbers for Console Log statements

If `instrument.js` displays in your console while debugging, add Sentry to your framework [blackboxing](https://developer.chrome.com/devtools/docs/blackboxing) settings like: `/@sentry/` so Chrome ignores the SDK stackframes when debugging. 

{%- endcapture -%}

{%- include common/troubleshooting-common.md 
sdk_name="JavaScript"

troubleshooting-content=__troubleshooting-content
root_link="javascript"
 -%}
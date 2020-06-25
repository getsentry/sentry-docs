---
title: 'Webhook Plugin'
---

### Webhook Plugin

When the webhook plugin is enabled and configured with one or more URLs, you can use it in the [action section](/workflow/alerts-notifications/alerts/#actions) of the alert rules. When an event triggers a rule that has the Webhook Plugin as one of the actions, the following attributes and payload will be sent to the URL(s) specified in the plugin configuration.
 
**Attributes**

**`id`**
- type: string
- description: The issue id for the issue associated with the event

**`project`**
- type: string
- description: The project slug for the project associated with the event

**`project_name`**
- type: string
- description: The project name for the project associated with the event

**`project_slug`**
- type: string
- description: The project slug for the project associated with the event

**`logger`**
- type: string
- description: value of the logger tag if available 

**`level`**
- type: string
- description: the level of the event (`info`, `debug`, `warning`, `error`, `fatal`)

**`culprit`** 
- type: string
- description: value of the issue culprit if available 

**`message`** 
- type: string
- description: value of the message of the event 

**`url`**
- type: url
- description: web url for the issue associated with the event

**`triggering_rules`**
- type: array
- description: list of rules triggered by the event

**`event`**
- type: object
- description: the event that triggered the alert rule

**`event`[`tags`]**
- type: array
- description: the tags for the event

**`event`[`event_id`]**
- type: string
- description: the client side generated eventid

**`event`[`id`]**
- type: string
- description: same value as the `event_id`


#### Payload

```json
{
   "project_name":"Meow",
   "message":"",
   "id":"1385042923",
   "culprit":"?(runner)",
   "project_slug":"meow",
   "url":"https://sentry.io/organizations/meredith/issues/1385042923/?referrer=webhooks_plugin",
   "level":"error",
   "triggering_rules":[
      "Webhook Test"
   ],
   "event":{
      "grouping_config":{
         "enhancements":"eJybzDhxY05qemJypZWRgaGlroGxrqHRBABbEwcC",
         "id":"legacy:2019-03-12"
      },
      "_ref_version":2,
      "_ref":115550,
      "id":"af17d39f6a5d4c19ae5a735043a3bd97",
      "culprit":"?(runner)",
      "title":"ReferenceError: hello is not defined",
      "event_id":"af17d39f6a5d4c19ae5a735043a3bd97",
      "platform":"javascript",
      "version":"7",
      "location":null,
      "logger":"",
      "type":"error",
      "metadata":{
         "type":"ReferenceError",
         "value":"hello is not defined"
      },
      "tags":[
         [
            "browser",
            "Chrome 76.0.3809"
         ],
         [
            "browser.name",
            "Chrome"
         ],
         [
            "handled",
            "no"
         ],
         [
            "level",
            "error"
         ],
         [
            "mechanism",
            "onerror"
         ],
         [
            "os",
            "Mac OS X 10.14.6"
         ],
         [
            "os.name",
            "Mac OS X"
         ],
         [
            "sentry:user",
            "ip:38.140.60.234"
         ],
         [
            "url",
            "https://null.jsbin.com/runner"
         ]
      ],
      "timestamp":1576778299.836607,
      "user":{
         "geo":{
            "city":"San Francisco",
            "region":"United States",
            "country_code":"US"
         },
         "ip_address":"38.140.60.234"
      },
      "fingerprint":[
         "{{ default }}"
      ],
      "hashes":[
         "3f5d58386a4b6fb194a5846f6019f7d0"
      ],
      "sdk":{
         "version":"5.5.0",
         "name":"sentry.javascript.browser",
         "packages":[
            {
               "version":"5.5.0",
               "name":"npm:@sentry/browser"
            }
         ],
         "integrations":[
            "InboundFilters",
            "FunctionToString",
            "TryCatch",
            "Breadcrumbs",
            "GlobalHandlers",
            "LinkedErrors",
            "UserAgent"
         ]
      },
      "received":1576778299.836607,
      "exception":{
         "values":[
            {
               "stacktrace":{
                  "frames":[
                     {
                        "function":null,
                        "abs_path":"https://null.jsbin.com/runner",
                        "errors":null,
                        "pre_context":[
                           "<!doctype html>",
                           "<html>"
                        ],
                        "vars":null,
                        "package":null,
                        "context_line":"<meta charset=utf-8>",
                        "symbol":null,
                        "image_addr":null,
                        "module":"runner",
                        "in_app":false,
                        "symbol_addr":null,
                        "lineno":3,
                        "filename":"/runner",
                        "post_context":[
                           "<title>JS Bin Runner</title>",
                           "",
                           "<style type=\"text/css\">",
                           "  body {",
                           "    margin: 0;"
                        ],
                        "colno":5,
                        "trust":null,
                        "data":{
                           "orig_in_app":1
                        },
                        "platform":null,
                        "instruction_addr":null,
                        "raw_function":null
                     }
                  ]
               },
               "type":"ReferenceError",
               "mechanism":{
                  "synthetic":null,
                  "help_link":null,
                  "data":{
                     "message":"hello is not defined",
                     "mode":"stack",
                     "name":"ReferenceError"
                  },
                  "meta":null,
                  "handled":false,
                  "type":"onerror",
                  "description":null
               },
               "value":"hello is not defined"
            }
         ]
      },
      "level":"error",
      "contexts":{
         "os":{
            "version":"10.14.6",
            "type":"os",
            "name":"Mac OS X"
         },
         "browser":{
            "version":"76.0.3809",
            "type":"browser",
            "name":"Chrome"
         }
      },
      "request":{
         "cookies":null,
         "url":"https://null.jsbin.com/runner",
         "headers":[
            [
               "User-Agent",
               "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
            ]
         ],
         "env":null,
         "fragment":null,
         "query_string":[

         ],
         "data":null,
         "method":null,
         "inferred_content_type":null
      },
      "project":1152450,
      "key_id":"101697"
   },
   "project":"meow",
   "logger":null
}

```

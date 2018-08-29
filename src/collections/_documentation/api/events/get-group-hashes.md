---
title: 'List an Issue’s Hashes'
sidebar_order: 6
---

GET /api/0/issues/_{issue_id}_/hashes/

: This endpoint lists an issue’s hashes, which are the generated checksums used to aggregate individual events.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>issue_id</strong> (<em>string</em>) – the ID of the issue to retrieve.</td></tr><tr><th>Authentication:</th><td>required</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/issues/<em>{issue_id}</em>/hashes/</td></tr></tbody></table>

## Example

```http
GET /api/0/issues/1/hashes/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
{% raw %}HTTP/1.1 200 OK
Allow: GET, DELETE, HEAD, OPTIONS
Content-Language: en
Content-Length: 8588
Content-Type: application/json
Link: <https://sentry.io/api/0/issues/1/hashes/?&cursor=1:0:1>; rel="previous"; results="false"; cursor="1:0:1", <https://sentry.io/api/0/issues/1/hashes/?&cursor=1:100:0>; rel="next"; results="false"; cursor="1:100:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "latestEvent": {
      "eventID": "332d51f6b28b4bc1ac52d16540c51394",
      "sdk": null,
      "errors": [],
      "dist": null,
      "platform": "python",
      "contexts": {},
      "user": {
        "username": "sentry",
        "ip_address": "127.0.0.1",
        "email": "sentry@example.com",
        "name": "Sentry",
        "id": "1"
      },
      "fingerprints": [
        "c4a4d06bc314205bb3b6bdb612dde7f1"
      ],
      "dateCreated": "2018-08-22T18:23:44Z",
      "dateReceived": "2018-08-22T18:23:44Z",
      "size": 7055,
      "context": {
        "emptyList": [],
        "unauthorized": false,
        "emptyMap": {},
        "url": "http://example.org/foo/bar/",
        "results": [
          1,
          2,
          3,
          4,
          5
        ],
        "length": 10837790,
        "session": {
          "foo": "bar"
        }
      },
      "entries": [
        {
          "type": "message",
          "data": {
            "message": "This is an example Python exception"
          }
        },
        {
          "type": "stacktrace",
          "data": {
            "frames": [
              {
                "function": "build_msg",
                "errors": null,
                "colNo": null,
                "module": "raven.base",
                "package": null,
                "absPath": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
                "inApp": false,
                "instructionAddr": null,
                "filename": "raven/base.py",
                "platform": null,
                "vars": {
                  "'frames'": "<generator object iter_stack_frames at 0x107bcc3c0>",
                  "'culprit'": null,
                  "'event_type'": "'raven.events.Message'",
                  "'date'": "datetime.datetime(2013, 8, 13, 3, 8, 24, 880386)",
                  "'extra'": {
                    "'go_deeper'": [
                      [
                        {
                          "'bar'": [
                            "'baz'"
                          ],
                          "'foo'": "'bar'"
                        }
                      ]
                    ],
                    "'user'": "'dcramer'",
                    "'loadavg'": [
                      0.37255859375,
                      0.5341796875,
                      0.62939453125
                    ]
                  },
                  "'v'": {
                    "'message'": "u'This is a test message generated using ``raven test``'",
                    "'params'": []
                  },
                  "'kwargs'": {
                    "'message'": "'This is a test message generated using ``raven test``'",
                    "'level'": 20
                  },
                  "'event_id'": "'54a322436e1b47b88e239b78998ae742'",
                  "'tags'": null,
                  "'data'": {
                    "'sentry.interfaces.Message'": {
                      "'message'": "u'This is a test message generated using ``raven test``'",
                      "'params'": []
                    },
                    "'message'": "u'This is a test message generated using ``raven test``'"
                  },
                  "'self'": "<raven.base.Client object at 0x107bb8210>",
                  "'time_spent'": null,
                  "'result'": {
                    "'sentry.interfaces.Message'": {
                      "'message'": "u'This is a test message generated using ``raven test``'",
                      "'params'": []
                    },
                    "'message'": "u'This is a test message generated using ``raven test``'"
                  },
                  "'stack'": true,
                  "'handler'": "<raven.events.Message object at 0x107bd0890>",
                  "'k'": "'sentry.interfaces.Message'",
                  "'public_key'": null
                },
                "lineNo": 303,
                "context": [
                  [
                    298,
                    "                frames = stack"
                  ],
                  [
                    299,
                    ""
                  ],
                  [
                    300,
                    "            data.update({"
                  ],
                  [
                    301,
                    "                'sentry.interfaces.Stacktrace': {"
                  ],
                  [
                    302,
                    "                    'frames': get_stack_info(frames,"
                  ],
                  [
                    303,
                    "                        transformer=self.transform)"
                  ],
                  [
                    304,
                    "                },"
                  ],
                  [
                    305,
                    "            })"
                  ],
                  [
                    306,
                    ""
                  ],
                  [
                    307,
                    "        if 'sentry.interfaces.Stacktrace' in data:"
                  ],
                  [
                    308,
                    "            if self.include_paths:"
                  ]
                ],
                "symbolAddr": null,
                "symbol": null
              },
              {
                "function": "capture",
                "errors": null,
                "colNo": null,
                "module": "raven.base",
                "package": null,
                "absPath": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
                "inApp": false,
                "instructionAddr": null,
                "filename": "raven/base.py",
                "platform": null,
                "vars": {
                  "'event_type'": "'raven.events.Message'",
                  "'date'": null,
                  "'extra'": {
                    "'go_deeper'": [
                      [
                        {
                          "'bar'": [
                            "'baz'"
                          ],
                          "'foo'": "'bar'"
                        }
                      ]
                    ],
                    "'user'": "'dcramer'",
                    "'loadavg'": [
                      0.37255859375,
                      0.5341796875,
                      0.62939453125
                    ]
                  },
                  "'stack'": true,
                  "'tags'": null,
                  "'data'": null,
                  "'self'": "<raven.base.Client object at 0x107bb8210>",
                  "'time_spent'": null,
                  "'kwargs'": {
                    "'message'": "'This is a test message generated using ``raven test``'",
                    "'level'": 20
                  }
                },
                "lineNo": 459,
                "context": [
                  [
                    454,
                    "        if not self.is_enabled():"
                  ],
                  [
                    455,
                    "            return"
                  ],
                  [
                    456,
                    ""
                  ],
                  [
                    457,
                    "        data = self.build_msg("
                  ],
                  [
                    458,
                    "            event_type, data, date, time_spent, extra, stack, tags=tags,"
                  ],
                  [
                    459,
                    "            **kwargs)"
                  ],
                  [
                    460,
                    ""
                  ],
                  [
                    461,
                    "        self.send(**data)"
                  ],
                  [
                    462,
                    ""
                  ],
                  [
                    463,
                    "        return (data.get('event_id'),)"
                  ],
                  [
                    464,
                    ""
                  ]
                ],
                "symbolAddr": null,
                "symbol": null
              },
              {
                "function": "captureMessage",
                "errors": null,
                "colNo": null,
                "module": "raven.base",
                "package": null,
                "absPath": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
                "inApp": false,
                "instructionAddr": null,
                "filename": "raven/base.py",
                "platform": null,
                "vars": {
                  "'message'": "'This is a test message generated using ``raven test``'",
                  "'kwargs'": {
                    "'extra'": {
                      "'go_deeper'": [
                        [
                          {
                            "'bar'": [
                              "'baz'"
                            ],
                            "'foo'": "'bar'"
                          }
                        ]
                      ],
                      "'user'": "'dcramer'",
                      "'loadavg'": [
                        0.37255859375,
                        0.5341796875,
                        0.62939453125
                      ]
                    },
                    "'tags'": null,
                    "'data'": null,
                    "'level'": 20,
                    "'stack'": true
                  },
                  "'self'": "<raven.base.Client object at 0x107bb8210>"
                },
                "lineNo": 577,
                "context": [
                  [
                    572,
                    "        \"\"\""
                  ],
                  [
                    573,
                    "        Creates an event from ``message``."
                  ],
                  [
                    574,
                    ""
                  ],
                  [
                    575,
                    "        >>> client.captureMessage('My event just happened!')"
                  ],
                  [
                    576,
                    "        \"\"\""
                  ],
                  [
                    577,
                    "        return self.capture('raven.events.Message', message=message, **kwargs)"
                  ],
                  [
                    578,
                    ""
                  ],
                  [
                    579,
                    "    def captureException(self, exc_info=None, **kwargs):"
                  ],
                  [
                    580,
                    "        \"\"\""
                  ],
                  [
                    581,
                    "        Creates an event from an exception."
                  ],
                  [
                    582,
                    ""
                  ]
                ],
                "symbolAddr": null,
                "symbol": null
              },
              {
                "function": "send_test_message",
                "errors": null,
                "colNo": null,
                "module": "raven.scripts.runner",
                "package": null,
                "absPath": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/scripts/runner.py",
                "inApp": false,
                "instructionAddr": null,
                "filename": "raven/scripts/runner.py",
                "platform": null,
                "vars": {
                  "'client'": "<raven.base.Client object at 0x107bb8210>",
                  "'options'": {
                    "'tags'": null,
                    "'data'": null
                  },
                  "'data'": null,
                  "'k'": "'secret_key'"
                },
                "lineNo": 77,
                "context": [
                  [
                    72,
                    "        level=logging.INFO,"
                  ],
                  [
                    73,
                    "        stack=True,"
                  ],
                  [
                    74,
                    "        tags=options.get('tags', {}),"
                  ],
                  [
                    75,
                    "        extra={"
                  ],
                  [
                    76,
                    "            'user': get_uid(),"
                  ],
                  [
                    77,
                    "            'loadavg': get_loadavg(),"
                  ],
                  [
                    78,
                    "        },"
                  ],
                  [
                    79,
                    "    ))"
                  ],
                  [
                    80,
                    ""
                  ],
                  [
                    81,
                    "    if client.state.did_fail():"
                  ],
                  [
                    82,
                    "        print('error!')"
                  ]
                ],
                "symbolAddr": null,
                "symbol": null
              },
              {
                "function": "main",
                "errors": null,
                "colNo": null,
                "module": "raven.scripts.runner",
                "package": null,
                "absPath": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/scripts/runner.py",
                "inApp": false,
                "instructionAddr": null,
                "filename": "raven/scripts/runner.py",
                "platform": null,
                "vars": {
                  "'root'": "<logging.Logger object at 0x107ba5b10>",
                  "'parser'": "<optparse.OptionParser instance at 0x107ba3368>",
                  "'dsn'": "'https://ebc35f33e151401f9deac549978bda11:f3403f81e12e4c24942d505f086b2cad@sentry.io/1'",
                  "'opts'": "<Values at 0x107ba3b00: {'data': None, 'tags': None}>",
                  "'client'": "<raven.base.Client object at 0x107bb8210>",
                  "'args'": [
                    "'test'",
                    "'https://ebc35f33e151401f9deac549978bda11:f3403f81e12e4c24942d505f086b2cad@sentry.io/1'"
                  ]
                },
                "lineNo": 112,
                "context": [
                  [
                    107,
                    "    print(\"Using DSN configuration:\")"
                  ],
                  [
                    108,
                    "    print(\" \", dsn)"
                  ],
                  [
                    109,
                    "    print()"
                  ],
                  [
                    110,
                    ""
                  ],
                  [
                    111,
                    "    client = Client(dsn, include_paths=['raven'])"
                  ],
                  [
                    112,
                    "    send_test_message(client, opts.__dict__)"
                  ]
                ],
                "symbolAddr": null,
                "symbol": null
              }
            ],
            "framesOmitted": null,
            "registers": null,
            "hasSystemFrames": false
          }
        },
        {
          "type": "template",
          "data": {
            "lineNo": 14,
            "context": [
              [
                11,
                "{% endif %}\n"
              ],
              [
                12,
                "<script src=\"{% static 'debug_toolbar/js/toolbar.js' %}\"></script>\n"
              ],
              [
                13,
                "<div id=\"djDebug\" hidden=\"hidden\" dir=\"ltr\"\n"
              ],
              [
                14,
                "     data-store-id=\"{{ toolbar.store_id }}\" data-render-panel-url=\"{% url 'djdt:render_panel' %}\"\n"
              ],
              [
                15,
                "     {{ toolbar.config.ROOT_TAG_EXTRA_ATTRS|safe }}>\n"
              ],
              [
                16,
                "\t<div hidden=\"hidden\" id=\"djDebugToolbar\">\n"
              ],
              [
                17,
                "\t\t<ul id=\"djDebugPanelList\">\n"
              ]
            ],
            "filename": "debug_toolbar/base.html"
          }
        },
        {
          "type": "request",
          "data": {
            "cookies": [
              [
                "foo",
                "bar"
              ],
              [
                "biz",
                "baz"
              ]
            ],
            "fragment": "",
            "headers": [
              [
                "Content-Type",
                "application/json"
              ],
              [
                "Referer",
                "http://example.com"
              ],
              [
                "User-Agent",
                "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.72 Safari/537.36"
              ]
            ],
            "inferredContentType": "application/json",
            "url": "http://example.com/foo",
            "env": {
              "ENV": "prod"
            },
            "query": "foo=bar",
            "data": {
              "hello": "world"
            },
            "method": "GET"
          }
        }
      ],
      "id": "1",
      "message": "This is an example Python exception",
      "packages": {
        "my.package": "1.0.0"
      },
      "type": "default",
      "groupID": "1",
      "tags": [
        {
          "value": "Chrome 28.0",
          "key": "browser"
        },
        {
          "value": "Other",
          "key": "device"
        },
        {
          "value": "error",
          "key": "level"
        },
        {
          "value": "Windows 8",
          "key": "os"
        },
        {
          "value": "e48e7b5b90327ea1a4d1a4360c735eee7b536f82",
          "key": "release"
        },
        {
          "value": "http://example.com/foo",
          "key": "url"
        },
        {
          "value": "id:1",
          "key": "user"
        }
      ],
      "metadata": {
        "title": "This is an example Python exception"
      }
    },
    "state": "unlocked",
    "id": "c4a4d06bc314205bb3b6bdb612dde7f1"
  }
]{% endraw %}
```

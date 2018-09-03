---
title: 'List a Project’s Events'
sidebar_order: 2
---

GET /api/0/projects/_{organization_slug}_/_{project_slug}_/events/

: Return a list of events bound to a project.

  Note: This endpoint is experimental and may be removed without notice.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><ul><li><strong>organization_slug</strong> (<em>string</em>) – the slug of the organization the groups belong to.</li><li><strong>project_slug</strong> (<em>string</em>) – the slug of the project the groups belong to.</li></ul></td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/projects/<em>{organization_slug}</em>/<em>{project_slug}</em>/events/</td></tr></tbody></table>

## Example

```http
GET /api/0/projects/the-interstellar-jurisdiction/pump-station/events/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: sentry.io
```

```http
{% raw %}HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 31868
Content-Type: application/json
Link: <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/events/?&cursor=1534962226000:0:1>; rel="previous"; results="false"; cursor="1534962226000:0:1", <https://sentry.io/api/0/projects/the-interstellar-jurisdiction/pump-station/events/?&cursor=1534962224000:1:0>; rel="next"; results="false"; cursor="1534962224000:1:0"
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

[
  {
    "eventID": "852906aafa1c4932bb6a75b8d02a540a",
    "sdk": {
      "version": "1.4.0-3ded0",
      "name": "sentry-java",
      "upstream": {
        "url": "https://docs.sentry.io/clients/java/",
        "isNewer": true,
        "name": "sentry-java"
      }
    },
    "errors": [
      {
        "type": "invalid_attribute",
        "message": "Discarded invalid parameter 'version'",
        "data": {
          "name": "version"
        }
      },
      {
        "type": "invalid_attribute",
        "message": "Discarded invalid parameter 'type'",
        "data": {
          "name": "type"
        }
      }
    ],
    "dist": null,
    "platform": "java",
    "contexts": {},
    "user": {
      "username": "sentry",
      "ip_address": "127.0.0.1",
      "email": "sentry@example.com",
      "name": "Sentry",
      "id": "1"
    },
    "fingerprints": [
      "16bcfa056ee73de2bc7846c8358f619d"
    ],
    "dateCreated": "2018-08-22T18:23:46Z",
    "dateReceived": "2018-08-22T18:23:46Z",
    "size": 13400,
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
          "message": "Authentication failed, token expired!",
          "formatted": "This is an example Java exception"
        }
      },
      {
        "type": "exception",
        "data": {
          "values": [
            {
              "stacktrace": {
                "frames": [
                  {
                    "function": "run",
                    "errors": null,
                    "colNo": null,
                    "module": "java.lang.Thread",
                    "package": null,
                    "absPath": "Thread.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "Thread.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 748,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "run",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.tomcat.util.threads.TaskThread$WrappingRunnable",
                    "package": null,
                    "absPath": "TaskThread.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "TaskThread.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 61,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "run",
                    "errors": null,
                    "colNo": null,
                    "module": "java.util.concurrent.ThreadPoolExecutor$Worker",
                    "package": null,
                    "absPath": "ThreadPoolExecutor.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ThreadPoolExecutor.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 624,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "runWorker",
                    "errors": null,
                    "colNo": null,
                    "module": "java.util.concurrent.ThreadPoolExecutor",
                    "package": null,
                    "absPath": "ThreadPoolExecutor.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ThreadPoolExecutor.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 1149,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "run",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.tomcat.util.net.SocketProcessorBase",
                    "package": null,
                    "absPath": "SocketProcessorBase.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "SocketProcessorBase.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 49,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doRun",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.tomcat.util.net.NioEndpoint$SocketProcessor",
                    "package": null,
                    "absPath": "NioEndpoint.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "NioEndpoint.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 1434,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "process",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.coyote.AbstractProtocol$ConnectionHandler",
                    "package": null,
                    "absPath": "AbstractProtocol.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "AbstractProtocol.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 798,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "process",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.coyote.AbstractProcessorLight",
                    "package": null,
                    "absPath": "AbstractProcessorLight.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "AbstractProcessorLight.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 66,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "service",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.coyote.http11.Http11Processor",
                    "package": null,
                    "absPath": "Http11Processor.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "Http11Processor.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 783,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "service",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.connector.CoyoteAdapter",
                    "package": null,
                    "absPath": "CoyoteAdapter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "CoyoteAdapter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 349,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.StandardEngineValve",
                    "package": null,
                    "absPath": "StandardEngineValve.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "StandardEngineValve.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 87,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.valves.ErrorReportValve",
                    "package": null,
                    "absPath": "ErrorReportValve.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ErrorReportValve.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 79,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.StandardHostValve",
                    "package": null,
                    "absPath": "StandardHostValve.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "StandardHostValve.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 140,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.authenticator.AuthenticatorBase",
                    "package": null,
                    "absPath": "AuthenticatorBase.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "AuthenticatorBase.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 474,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.StandardContextValve",
                    "package": null,
                    "absPath": "StandardContextValve.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "StandardContextValve.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 96,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.StandardWrapperValve",
                    "package": null,
                    "absPath": "StandardWrapperValve.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "StandardWrapperValve.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 198,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 165,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "internalDoFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 192,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.OncePerRequestFilter",
                    "package": null,
                    "absPath": "OncePerRequestFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "OncePerRequestFilter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 107,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilterInternal",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.CharacterEncodingFilter",
                    "package": null,
                    "absPath": "CharacterEncodingFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "CharacterEncodingFilter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 197,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 165,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "internalDoFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 192,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.OncePerRequestFilter",
                    "package": null,
                    "absPath": "OncePerRequestFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "OncePerRequestFilter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 107,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilterInternal",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.HiddenHttpMethodFilter",
                    "package": null,
                    "absPath": "HiddenHttpMethodFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "HiddenHttpMethodFilter.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 81,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 165,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "internalDoFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 192,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.OncePerRequestFilter",
                    "package": null,
                    "absPath": "OncePerRequestFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "OncePerRequestFilter.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 107,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilterInternal",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.HttpPutFormContentFilter",
                    "package": null,
                    "absPath": "HttpPutFormContentFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "HttpPutFormContentFilter.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 105,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 165,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "internalDoFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 192,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.OncePerRequestFilter",
                    "package": null,
                    "absPath": "OncePerRequestFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "OncePerRequestFilter.java",
                    "platform": null,
                    "vars": null,
                    "lineNo": 107,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilterInternal",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.filter.RequestContextFilter",
                    "package": null,
                    "absPath": "RequestContextFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "RequestContextFilter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 99,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 165,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "internalDoFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 192,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.tomcat.websocket.server.WsFilter",
                    "package": null,
                    "absPath": "WsFilter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "WsFilter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 52,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 165,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "internalDoFilter",
                    "errors": null,
                    "colNo": null,
                    "module": "org.apache.catalina.core.ApplicationFilterChain",
                    "package": null,
                    "absPath": "ApplicationFilterChain.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ApplicationFilterChain.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 230,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "service",
                    "errors": null,
                    "colNo": null,
                    "module": "javax.servlet.http.HttpServlet",
                    "package": null,
                    "absPath": "HttpServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "HttpServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 729,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "service",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.FrameworkServlet",
                    "package": null,
                    "absPath": "FrameworkServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "FrameworkServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 846,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "service",
                    "errors": null,
                    "colNo": null,
                    "module": "javax.servlet.http.HttpServlet",
                    "package": null,
                    "absPath": "HttpServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "HttpServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 622,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doGet",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.FrameworkServlet",
                    "package": null,
                    "absPath": "FrameworkServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "FrameworkServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 861,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "processRequest",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.FrameworkServlet",
                    "package": null,
                    "absPath": "FrameworkServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "FrameworkServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 970,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doService",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.DispatcherServlet",
                    "package": null,
                    "absPath": "DispatcherServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "DispatcherServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 897,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doDispatch",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.DispatcherServlet",
                    "package": null,
                    "absPath": "DispatcherServlet.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "DispatcherServlet.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 963,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "handle",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter",
                    "package": null,
                    "absPath": "AbstractHandlerMethodAdapter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "AbstractHandlerMethodAdapter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 85,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "handleInternal",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter",
                    "package": null,
                    "absPath": "RequestMappingHandlerAdapter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "RequestMappingHandlerAdapter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 738,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invokeHandlerMethod",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter",
                    "package": null,
                    "absPath": "RequestMappingHandlerAdapter.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "RequestMappingHandlerAdapter.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 827,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invokeAndHandle",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod",
                    "package": null,
                    "absPath": "ServletInvocableHandlerMethod.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "ServletInvocableHandlerMethod.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 116,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invokeForRequest",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.method.support.InvocableHandlerMethod",
                    "package": null,
                    "absPath": "InvocableHandlerMethod.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "InvocableHandlerMethod.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 133,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "doInvoke",
                    "errors": null,
                    "colNo": null,
                    "module": "org.springframework.web.method.support.InvocableHandlerMethod",
                    "package": null,
                    "absPath": "InvocableHandlerMethod.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "InvocableHandlerMethod.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 205,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "java.lang.reflect.Method",
                    "package": null,
                    "absPath": "Method.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "Method.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 498,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "sun.reflect.DelegatingMethodAccessorImpl",
                    "package": null,
                    "absPath": "DelegatingMethodAccessorImpl.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "DelegatingMethodAccessorImpl.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 43,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke",
                    "errors": null,
                    "colNo": null,
                    "module": "sun.reflect.NativeMethodAccessorImpl",
                    "package": null,
                    "absPath": "NativeMethodAccessorImpl.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "NativeMethodAccessorImpl.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 62,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "invoke0",
                    "errors": null,
                    "colNo": null,
                    "module": "sun.reflect.NativeMethodAccessorImpl",
                    "package": null,
                    "absPath": "NativeMethodAccessorImpl.java",
                    "inApp": false,
                    "instructionAddr": null,
                    "filename": "NativeMethodAccessorImpl.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": null,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "home",
                    "errors": null,
                    "colNo": null,
                    "module": "io.sentry.example.Application",
                    "package": null,
                    "absPath": "Application.java",
                    "inApp": true,
                    "instructionAddr": null,
                    "filename": "Application.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 102,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "fetch",
                    "errors": null,
                    "colNo": null,
                    "module": "io.sentry.example.Sidebar",
                    "package": null,
                    "absPath": "Sidebar.java",
                    "inApp": true,
                    "instructionAddr": null,
                    "filename": "Sidebar.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 5,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  },
                  {
                    "function": "perform",
                    "errors": null,
                    "colNo": null,
                    "module": "io.sentry.example.ApiRequest",
                    "package": null,
                    "absPath": "ApiRequest.java",
                    "inApp": true,
                    "instructionAddr": null,
                    "filename": "ApiRequest.java",
                    "platform": null,
                    "vars": {},
                    "lineNo": 8,
                    "context": [],
                    "symbolAddr": null,
                    "symbol": null
                  }
                ],
                "framesOmitted": null,
                "registers": null,
                "hasSystemFrames": true
              },
              "module": "io.sentry.example",
              "rawStacktrace": null,
              "mechanism": null,
              "threadId": null,
              "value": "Authentication failed, token expired!",
              "type": "ApiException"
            }
          ],
          "hasSystemFrames": true,
          "excOmitted": null
        }
      },
      {
        "type": "breadcrumbs",
        "data": {
          "values": [
            {
              "category": null,
              "level": "debug",
              "event_id": null,
              "timestamp": "2018-08-22T18:23:42.280Z",
              "type": "default",
              "message": "Querying for user.",
              "data": null
            },
            {
              "category": null,
              "level": "debug",
              "event_id": null,
              "timestamp": "2018-08-22T18:23:43.280Z",
              "type": "default",
              "message": "User found: user@sentry.io",
              "data": null
            },
            {
              "category": null,
              "level": "info",
              "event_id": null,
              "timestamp": "2018-08-22T18:23:44.280Z",
              "type": "default",
              "message": "Loaded homepage content from memcached.",
              "data": null
            },
            {
              "category": null,
              "level": "warning",
              "event_id": null,
              "timestamp": "2018-08-22T18:23:45.280Z",
              "type": "default",
              "message": "Sidebar content not in cache, hitting API server.",
              "data": null
            }
          ]
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
    "id": "2",
    "message": "This is an example Java exception",
    "packages": {
      "my.package": "1.0.0"
    },
    "type": "error",
    "groupID": "2",
    "tags": [
      {
        "value": "Chrome 60.0",
        "key": "browser"
      },
      {
        "value": "Other",
        "key": "device"
      },
      {
        "value": "production",
        "key": "environment"
      },
      {
        "value": "error",
        "key": "level"
      },
      {
        "value": "Mac OS X 10.12.6",
        "key": "os"
      },
      {
        "value": "e48e7b5b90327ea1a4d1a4360c735eee7b536f82",
        "key": "release"
      },
      {
        "value": "web1.example.com",
        "key": "server_name"
      },
      {
        "value": "http://localhost:8080/",
        "key": "url"
      },
      {
        "value": "id:1",
        "key": "user"
      }
    ],
    "metadata": {
      "type": "ApiException",
      "value": "Authentication failed, token expired!"
    }
  },
  {
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
  }
]{% endraw %}
```

---
title: 'Retrieve Oldest Event'
sidebar_order: 11
---

GET /api/0/issues/_{issue_id}_/events/oldest/

: Retrieves the details of the oldest event for an issue.

  <table class="table"><tbody valign="top"><tr><th>Path Parameters:</th><td><strong>group_id</strong> (<em>string</em>) – the ID of the issue</td></tr><tr><th>Method:</th><td>GET</td></tr><tr><th>Path:</th><td>/api/0/issues/<em>{issue_id}</em>/events/oldest/</td></tr></tbody></table>

## Example

```http
GET /api/0/issues/2/events/oldest/ HTTP/1.1
Authorization: Bearer {base64-encoded-key-here}
Host: app.getsentry.com
```

```http
HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Content-Language: en
Content-Length: 23891
Content-Type: application/json
Vary: Accept-Language, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: deny
X-Xss-Protection: 1; mode=block

{
  "eventID": "852906aafa1c4932bb6a75b8d02a540a",
  "dist": null,
  "userReport": null,
  "nextEventID": null,
  "previousEventID": null,
  "message": "This is an example Java exception",
  "id": "2",
  "size": 13400,
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
  "platform": "java",
  "type": "error",
  "metadata": {
    "type": "ApiException",
    "value": "Authentication failed, token expired!"
  },
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
  "dateCreated": "2018-08-22T18:23:46Z",
  "dateReceived": "2018-08-22T18:23:46Z",
  "user": {
    "username": "sentry",
    "ip_address": "127.0.0.1",
    "email": "sentry@example.com",
    "name": "Sentry",
    "id": "1"
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
  "packages": {
    "my.package": "1.0.0"
  },
  "sdk": {
    "version": "1.4.0-3ded0",
    "name": "sentry-java",
    "upstream": {
      "url": "https://docs.sentry.io/clients/java/",
      "isNewer": true,
      "name": "sentry-java"
    }
  },
  "contexts": {},
  "fingerprints": [
    "16bcfa056ee73de2bc7846c8358f619d"
  ],
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
  "release": {
    "dateReleased": null,
    "newGroups": 0,
    "url": null,
    "ref": null,
    "lastDeploy": null,
    "deployCount": 0,
    "dateCreated": "2018-08-22T18:23:44.439Z",
    "lastEvent": "2018-08-22T18:23:44.590Z",
    "version": "e48e7b5b90327ea1a4d1a4360c735eee7b536f82",
    "firstEvent": "2018-08-22T18:23:44.590Z",
    "lastCommit": null,
    "shortVersion": "e48e7b5",
    "authors": [],
    "owner": null,
    "commitCount": 0,
    "data": {},
    "projects": [
      {
        "name": "Pump Station",
        "slug": "pump-station"
      }
    ]
  },
  "groupID": "2"
}
```

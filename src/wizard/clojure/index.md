---
name: Clojure
doc_link: https://docs.sentry.io/platforms/clojure/
support_level: production
type: language
---

## Install

Install the SDK via deps, leiningen or boot:

```clojure {tabTitle:deps}
:deps {io.sentry/sentry {:mvn/version "3.0.0"}
       io.sentry/sentry-clj {:mvn/version "3.0.0"}}
```

```clojure {tabTitle:leiningen}
:dependencies [[io.sentry/sentry "3.0.0"]
               [io.sentry/sentry-clj "3.0.0"]]
```

```clojure {tabTitle:boot}
(set-env!
   :dependencies '[[io.sentry/sentry "3.0.0"]
                   [io.sentry/sentry-clj "3.0.0"]]
```

## Configure

Initialize Sentry with the `init!` function. Remember to configure the DSN and any other [settings](https://github.com/getsentry/sentry-clj) you need:

```clojure
(ns foo
 (:require
  [sentry-clj.core :as sentry]))

(def dsn "https://abcdefg@localhost:9000/2")
(def config {:environment "production"}

(def sentry-logger (sentry/init! dsn config))

```

### Sending Your First Event

You can trigger your first event from your development environment by raising an exception somewhere within your application, catching it and passing
the details to the sentry logger you created (this can also be done on the REPL for experimentation)

```clojure
(try
  (/ 42 0)
  (catch Exception e)
    (sentry-logger {:message "Oh No!" :throwable e}))
```

More examples and further information can be found at the [Github Repository](https://github.com/getsentry/sentry-clj)

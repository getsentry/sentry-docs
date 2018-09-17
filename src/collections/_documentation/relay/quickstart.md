---
title: 'Getting started'
sidebar_order: 1
---

Download one of the binaries at
[GitHub](https://github.com/getsentry/semaphore/releases), and store the
downloaded binary somewhere in your `$PATH`. After that, you can use the config
wizard:

    # The codename of Relay is semaphore
    $ semaphore config init
    Initializing relay in /Users/untitaker/projects/semaphore/.semaphore
    There is no relay config yet. Do you want to create one?
    > yes, create default config
      yes, create custom config
      no, abort
    Do you want to enable the internal crash reporting?
    > yes, share relay internal crash reports with sentry.io
      no, do not share crash reports
    There are currently no credentials set up. Do you want to create some?
    > no, just use relay without setting up credentials (simple proxy mode, recommended)
      yes, set up relay with credentials (currently requires own Sentry installation)
    All done!

{% capture __alert_content -%}
If you're using on-prem, you need to create a custom config for your relay. Answer accordingly to the first question of the wizard.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

You now have a folder named `.semaphore` in your current working directory. To
launch the server, run:

    semaphore run

If you moved your config folder somewhere else, you can use the `-c` option:

    semaphore run -c ./my/custom/semaphore_folder/

## Setting up a project

Right now Relay is only really usable in "simple proxy mode" (without
credentials), and as such calls the same exact endpoints on Sentry that an SDK
would. That unfortunately also means you have to configure each project
individually in Relay for now.

Create a new file named:

```
.semaphore/project/___PROJECT_ID___.json
```

With the following content:

```json
{
    "allowedDomains": ["*"],
    "trustedRelays": [],
    "publicKeys": ["___PUBLIC_KEY___"],
    "config": {
        "piiConfig": {}
    }
}
```

The relay has to know all public keys (i.e. the secret part of the DSN) that
will send events to it. DSNs unknown for this project will be rejected.

## Sending a test event

Launch the server with `semaphore run`, and set up any SDK with the following DSN:

```
http://___PUBLIC_KEY___@127.0.0.1:3000/___PROJECT_ID___
```

As you can see we only changed the host and port of the DSN to point to your
Relay setup. You should be able to use the SDK normally at this point. Events
arrive at the Sentry instance that Relay is configured to use in
`.semaphore/config.yml`.

## PII stripping

Now let's get to the entire point of this proxy setup: Stripping sensitive
data.

The easiest way to go about this is if you already have a raw JSON payload from some SDK. Go to our PII config editor [PIInGUIn](https://getsentry.github.io/piinguin/), and:

1. Paste in a raw event
2. Click on data you want eliminated
3. Paste in other payloads and see if they look fine, go to step **2** if necessary.

After iterating on the config, paste it back into the project config you created earlier:

```
.semaphore/project/___PROJECT_ID___.json
```


For example:

```json
{
    "allowedDomains": ["*"],
    "trustedRelays": [],
    "publicKeys": ["___PUBLIC_KEY___"],
    "config": {
        "piiConfig": {
            "rules": {
                "device_id": {
                    "type": "pattern",
                    "pattern": "d/[a-f0-9]{12}",
                    "redaction": {
                        "method": "hash"
                    }
                },
                "applications": {
                    "freeform": ["device_id"]
                }
            }
        }
    }
}
```
